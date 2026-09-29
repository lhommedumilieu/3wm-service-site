#!/usr/bin/env bash
# =====================================================================
#  web-3wm - Script 11 : autoriser l'IA (Ollama) a traiter plusieurs
#  discussions en meme temps
#  Prepare par Claude
#
#  A lancer SUR ia-3wm (la machine qui fait tourner Ollama, PAS le
#  serveur du site) avec :   sudo bash activer-ia-parallele.sh
#
#  Pourquoi : par defaut, Ollama peut ne traiter qu'UNE seule
#  conversation a la fois si la machine n'a pas beaucoup de memoire.
#  Si une 2e personne ecrit pendant que l'IA repond deja a quelqu'un
#  d'autre, elle doit attendre en silence, ce qui donne l'impression
#  que l'assistant est bloque ou hors service.
#
#  Ce script verifie la memoire disponible et, si elle est suffisante,
#  autorise Ollama a traiter 2 conversations en parallele.
# =====================================================================
set -uo pipefail
JOURNAL="$HOME/journal-script11-$(date +%Y%m%d-%H%M).txt"
exec > >(tee -a "$JOURNAL") 2>&1
VERT='\e[32m'; JAUNE='\e[33m'; ROUGE='\e[31m'; CYAN='\e[36m'; FIN='\e[0m'
etape()  { echo -e "\n${CYAN}==== $* ====${FIN}"; }
ok()     { echo -e "  ${VERT}[OK]${FIN} $*"; }
alerte() { echo -e "  ${JAUNE}[!]${FIN}  $*"; }
erreur() { echo -e "  ${ROUGE}[ERREUR]${FIN} $*"; }

if [[ $EUID -ne 0 ]]; then echo "Lance-moi avec : sudo bash $0"; exit 1; fi

etape "1. Verification qu'Ollama tourne bien ici"
if ! systemctl list-unit-files 2>/dev/null | grep -q '^ollama.service'; then
  erreur "Le service 'ollama' n'existe pas sur cette machine."
  echo "  Ce script doit etre lance SUR ia-3wm (la machine de l'IA), pas sur web-3wm."
  exit 1
fi
ok "Service ollama trouve"

etape "2. Memoire disponible sur cette machine"
MEM_TOTAL_MO=$(free -m | awk '/^Mem:/{print $2}')
MEM_TOTAL_GO=$((MEM_TOTAL_MO / 1024))
echo "  Memoire totale : ${MEM_TOTAL_MO} Mo (~${MEM_TOTAL_GO} Go)"

if [[ "$MEM_TOTAL_MO" -ge 12000 ]]; then
  PARALLELE=2
  ok "Assez de memoire pour 2 conversations en meme temps (OLLAMA_NUM_PARALLEL=2)"
elif [[ "$MEM_TOTAL_MO" -ge 8000 ]]; then
  PARALLELE=2
  alerte "Memoire un peu juste (${MEM_TOTAL_GO} Go). On active quand meme 2 conversations en parallele,"
  alerte "mais si l'IA devient lente ou plante, il faudra soit ajouter de la RAM a cette VM,"
  alerte "soit repasser a 1 seule conversation a la fois (relance ce script apres avoir modifie MEM_MINI si besoin)."
else
  PARALLELE=1
  erreur "Memoire insuffisante (${MEM_TOTAL_GO} Go) pour traiter 2 conversations en meme temps"
  echo "  sans risquer de faire planter ou beaucoup ralentir l'IA."
  echo "  Ce script va seulement s'assurer qu'un maximum de 1 est bien configure"
  echo "  (comportement par defaut), pour eviter tout plantage."
  echo "  Pour vraiment supporter 2 personnes en meme temps, il faudra ajouter de la RAM"
  echo "  a cette VM (viser au moins 12 Go)."
fi

etape "3. Configuration du service ollama (OLLAMA_NUM_PARALLEL=$PARALLELE)"
mkdir -p /etc/systemd/system/ollama.service.d
cat > /etc/systemd/system/ollama.service.d/override.conf <<EOF
[Service]
Environment="OLLAMA_NUM_PARALLEL=$PARALLELE"
EOF
ok "Fichier /etc/systemd/system/ollama.service.d/override.conf ecrit"

systemctl daemon-reload
systemctl restart ollama
sleep 3
if systemctl is-active --quiet ollama; then
  ok "Service ollama relance avec succes (OLLAMA_NUM_PARALLEL=$PARALLELE)"
else
  erreur "Le service ollama n'a pas redemarre correctement, voir : sudo journalctl -u ollama -n 50"
  exit 1
fi

etape "Termine"
echo "  Journal : $JOURNAL"
if [[ "$PARALLELE" -ge 2 ]]; then
  echo "  L'IA du site peut maintenant repondre a 2 conversations en meme temps."
  echo "  Pense aussi a mettre a jour web-3wm (sudo maj-site puis sudo systemctl restart chat-ia)"
  echo "  pour que le service qui fait le lien avec le site attende un peu plus longtemps"
  echo "  la reponse de l'IA."
else
  echo "  L'IA reste limitee a 1 conversation a la fois (memoire insuffisante pour plus)."
fi
