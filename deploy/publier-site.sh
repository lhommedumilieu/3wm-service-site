#!/bin/bash
# Publie le site 3wm-service-site sur CE serveur : compile le site (Vite)
# puis copie le résultat dans le dossier servi par nginx.
#
# Utilisation, depuis le serveur web-3wm, après avoir récupéré le code
# à jour (ex. "sudo maj-site") :
#
#   bash ~/3wm-service/deploy/publier-site.sh
#
# À adapter une seule fois si besoin : la variable WEB_ROOT ci-dessous
# doit correspondre au "root" utilisé dans deploy/nginx-3wm-site.conf.

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_DIR="$(dirname "$SCRIPT_DIR")"
WEB_ROOT="/var/www/3wm-site"

echo "→ Dossier du site : $REPO_DIR"
cd "$REPO_DIR"

echo "→ Installation des dépendances (npm ci)…"
npm ci

echo "→ Compilation du site (npm run build)…"
npm run build

echo "→ Publication vers $WEB_ROOT…"
sudo mkdir -p "$WEB_ROOT"
sudo rsync -a --delete dist/ "$WEB_ROOT"/

echo "→ Site publié. Vérifie sur https://3-wm.net (ou sur l'IP du serveur avant le changement DNS)."
