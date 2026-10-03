#!/usr/bin/env bash
# =====================================================================
#  web-3wm : ajoute la route nginx /api/fuites (verification des fuites
#  d'adresse e-mail dans l'espace membre).
#  Prepare par Claude.
#
#  A lancer SUR web-3wm, depuis la racine du depot du site (apres
#  "sudo maj-site") :   sudo bash server/ajouter-route-fuites.sh
#
#  Ce script ajoute la route nginx /api/fuites (meme service que /api/chat,
#  port 3001), recharge nginx et redemarre le service chat-ia pour qu'il
#  charge le nouveau code.
# =====================================================================
set -uo pipefail
if [[ $EUID -ne 0 ]]; then echo "Lance-moi avec : sudo bash $0"; exit 1; fi

CONF=$(grep -rl "location /api/chat" /etc/nginx/sites-available/ 2>/dev/null | head -n1)
if [[ -z "$CONF" ]]; then
  echo "[ERREUR] Config nginx avec /api/chat introuvable. Lance d'abord : sudo bash server/deploy-chat-ia.sh"
  exit 1
fi

if grep -q "location /api/fuites" "$CONF"; then
  echo "[OK] La route /api/fuites existe deja dans $CONF"
else
  cp "$CONF" "$CONF.bak-$(date +%Y%m%d-%H%M)"
  # Insere le nouveau bloc juste avant le bloc /api/chat
  awk '
    /location \/api\/chat/ && !fait {
      print "    location /api/fuites {"
      print "        proxy_pass http://127.0.0.1:3001;"
      print "        proxy_set_header Host $host;"
      print "        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;"
      print "    }"
      print ""
      fait=1
    }
    { print }
  ' "$CONF" > "$CONF.new" && mv "$CONF.new" "$CONF"
  if nginx -t >/dev/null 2>&1; then
    systemctl reload nginx
    echo "[OK] Route /api/fuites ajoutee, nginx recharge"
  else
    echo "[ERREUR] Config nginx invalide, restauration de la sauvegarde"
    cp "$CONF.bak-"* "$CONF" 2>/dev/null
    nginx -t
    exit 1
  fi
fi

systemctl restart chat-ia
sleep 2
if systemctl is-active --quiet chat-ia; then
  echo "[OK] Service chat-ia redemarre avec le nouveau code"
else
  echo "[ERREUR] chat-ia n'a pas redemarre : sudo journalctl -u chat-ia -n 30"
  exit 1
fi
echo ""
echo "Test rapide (doit repondre 401 'connexion_requise', c'est normal sans connexion) :"
curl -s -i -X POST http://localhost/api/fuites | head -n 1
