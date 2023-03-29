# Twitter App

Bienvenue dans ce workshop pour la création d'une mini app Twitter. Cette application
va nous permettre d'utiliser :

- `zod`
- `react-query`
- `next`

## Pré-requis

- [JavaScript à connaître pour commencer React](https://codelynx.dev/posts/javascript-known-to-start-react)
- [Les bases de React vue dans BeginReact](https://codelynx.dev/beginreact)
- Installer le React DevTools
  - [chrome](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en)
  - [Firefox](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/)

## Systems

- [git](https://git-scm.com/downloads) - v2 ou plus
- [node](https://nodejs.org/en/) - v12 ou plus
- [npm](https://nodejs.org/en/) - v6 ou plus
- [pnpm](https://pnpm.io/installation) - v7 ou plus

#### Vérifier les versions

```bash
git --version
node --version
npm --version
pnpm --version
```

Je vais utiliser `pnpm` durant tous le cours, tu peux utiliser le gestionnaire
de dépendances que tu veux.

## Setup du projet

```bash
git clone https://github.com/Melvynx/nextreact-twitter.git
cd nextreact-twitter
pnpm install
```

## Setup de la database

J'utililise [prisma](https://www.prisma.io/) pour la gestion de la database.

Elle est utiliser avec [sqlite](https://www.sqlite.org/index.html) pour la simplicité
de l'installation. (c'est un database dans un fichier, donc rien besoin d'installer)

Pour setup la database tu peux lancer :

```bash
pnpm prisma:setup
```

## Lancer le projet

```bash
pnpm dev
```

## Construction des exercices

En NextJS le routing est basée sur la structure de fichier qui est dans le dossier `pages`.
Je tiens à préciser qu'on est sur `NextJS version 13`.

Cette version, hybrid, va nous permettre de faire de NextJS 12 ainsi que NextJS 13 avec le `app` directory que tu découvriras dans les exercices.

Dans le dossier [pages/exercices](./pages/exercices) tu trouveras les exercices accompagner
de leur instructions.

Il y a aussi des exercices dans le dossier [pages/api/exercices](./pages/api/exercices) qui
sont des exercices qui ne sont pas basés sur le routing NextJS mais sur des API.

Et finalement tu trouveras des exercices dans [app/](./app) qui sont des exercices
qui ne sont pas basés sur la nouvelle version de NextJS.

Les exercices sont composés de différentes _parties_. Pour la partie 1, tu trouveras
des aides dans le fichiers exercices de la part des émojis. Pour les parties 2 ou plus
tu seras livrés à toi même.

Tu trouveras dans le dossiers [pages/solutions](./pages/solutions) les solutions de
chaque exercices et leur parties. Tu peux les consulter si tu bloques sur un exercice.

Tu trouveras sur la plateforme de formation :

- Une introduction a chaque exercice, qui t'explique où tu devras aller pour trouver
  les informations dont tu as besoin.
- Une vidéo de correction de chaque exercice, qui te montre comment je l'ai fait.

## Guide des émojis :

- 🦁 C'est **Lienx** le premier lynx dans un corps de lion du monde ! Il te donneras
  des indications claires que tu devras suivre.
- 💡 C'est des tips et astuces qui te permettront d'avancer. C'est un peu les cheat-code
  qui te donnent directement une partie de la réponse
- 💌 Elle t'informe pour chaque exercice ce que tu as appris. Ce n'est pas que dans
  l'exercice que tu apprends mais aussi dans la vidéo correction associée.
- ⚠️ Information importante à lire avant de faire l'exercice
- 📖 Lien vers la documentation officielle
- ℹ️ Petite information qui te permettent de
- 💣 Supprimer une ligne
