#!/bin/bash
# Publie le site 3wm-service-site sur CE serveur : compile le site (Vite)
# puis copie le résultat dans le dossier servi par nginx.
#
# Utilisation, depuis le serveur web-3wm, après avoir récupéré le code
# à jour (ex. "sudo maj-site") :
#
#   bash ~/3wm-service/deploy/publier-site.sh
#
# Réutilise la configuration nginx "3wm" déjà présente sur ce serveur
# (/etc/nginx/sites-available/3wm, root /var/www/3wm, gère déjà 3-wm.net,
# www.3-wm.net et le proxy /api/chat) — pas besoin d'une config séparée.

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_DIR="$(dirname "$SCRIPT_DIR")"
WEB_ROOT="/var/www/3wm"

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
