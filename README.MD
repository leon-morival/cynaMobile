# Cyna Mobile

Application mobile multi-plateforme développée avec React Native et Expo.

## À propos de l'application

Cyna Mobile est une application qui permet d'effectuer des achats en ligne

## Technologies utilisées

- **React Native** - Framework de développement multi-plateformes
- **Expo** - Plateforme pour simplifier le développement React Native
- **TypeScript** - Langage de programmation typé basé sur JavaScript

## Installation

# Installer les dépendances

npm i

````

## Développement

Utilisez le build de développement :

1. Préparez le build

   ```bash
   npx expo prebuild --clean
````

2. Lancez sur l'appareil/émulateur

   ```bash
   # Pour Android
   npx expo run:android

   # Pour iOS
   npx expo run:ios
   ```

## Déploiement

### Android

```bash
# Générer un APK de débogage
npx expo build:android -t apk

# Générer un bundle AAB pour le Play Store
npx expo build:android -t app-bundle
```

### iOS

```bash
# Générer un IPA pour TestFlight ou l'App Store
npx expo build:ios
```
