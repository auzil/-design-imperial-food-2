# Pizza a sushi s rozvozem, Praha 4 | Imperial Food

Static concept page exported from site-factory (dark-kitchen / c-custom). Open `index.html` in a browser — no build needed.

## Publish on GitHub Pages

```bash
cd clients/dark-kitchen/final
git init && git add . && git commit -m "Concept page"
git branch -M main
gh repo create dark-kitchen --public --source=. --push          # or create the repo on github.com and: git remote add origin … && git push -u origin main
gh api -X POST repos/{owner}/dark-kitchen/pages -f "source[branch]=main" -f "source[path]=/"   # or: repo Settings → Pages → Deploy from a branch → main / root
```

After changes in the prototype, export again (`npm run final -- dark-kitchen`) and push: `git add -A && git commit -m "Update" && git push` — the export keeps this folder's `.git`.

The page appears at `https://<your-user>.github.io/dark-kitchen/` after a minute. Re-export with `--url=https://<your-user>.github.io/dark-kitchen/` so link previews show `og.jpg`.

Search engines are told not to index it (`noindex`). The edit panel is off.
