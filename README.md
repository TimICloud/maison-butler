# Maison Butler — site vitrine

Conciergerie dédiée aux gîtes & hébergements de vacances
Commercialisation • Intendance • Expérience voyageurs
Plateau de Herve • Spa • Ardennes

Site statique (HTML / CSS / JS), sans dépendance.

- Pages : `index.html`, `services.html`, `contact.html`
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

## Crédits photos

Photos libres de droit issues d'[Unsplash](https://unsplash.com/license) (licence Unsplash : usage commercial gratuit, sans attribution obligatoire) :

| Fichier | Photo |
| --- | --- |
| `salon.jpg` | https://unsplash.com/photos/-_Rvjx9D7QY |
| `salon-cosy.jpg` | https://unsplash.com/photos/cQeZDBoQrgs |
| `chambre-vue.jpg` | https://unsplash.com/photos/3lQautLFzMs |
| `cuisine.jpg` | https://unsplash.com/photos/JbLev8Y0xUQ |
| `panier.jpg` | https://unsplash.com/photos/Bc4mMuxuBPw |
| `bain-nordique.jpg` | https://unsplash.com/photos/ozb0D8Foio4 |
| `salle-a-manger.jpg` | https://unsplash.com/photos/6vaqdXMl0dw |
| `herve.jpg` | https://unsplash.com/photos/fk4K_SRgOmY |
| `fagnes.jpg` | https://unsplash.com/photos/chjKbQr-mpY |
| `ardennes.jpg` | https://unsplash.com/photos/v6qAXUSsbSQ |
| `cles.jpg` | https://unsplash.com/photos/PxiAc1aElFQ |

`hero.jpg`, `terrasse.jpg`, `table.jpg` et `logo.jpg` sont les visuels de Maison Butler.
