# Maison Butler — site vitrine

Conciergerie dédiée aux gîtes & hébergements de vacances
Commercialisation • Intendance • Expérience voyageurs
Plateau de Herve • Spa • Ardennes

Site statique (HTML / CSS / JS), sans dépendance.

- Pages : `index.html`, `services.html`, `proprietaires.html`, `destinations.html`, `contact.html`
- Styles : `css/style.css` — Scripts : `js/main.js` — Images : `assets/img/`

## Modifier les pages

L'en-tête et le pied de page sont communs à toutes les pages. Les sources sont dans `_src/` :
modifier `_src/_top.html`, `_src/_bottom.html` ou `_src/<page>.html`, puis régénérer :

```bash
perl _src/build.pl _src .
```

## Aperçu local

```bash
ruby -run -e httpd . -p 8765
```
puis ouvrir http://localhost:8765
