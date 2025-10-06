# Capacitor Mobile App Setup - Schluck mal!

## ✅ Was wurde bereits eingerichtet?

1. ✅ Capacitor Pakete installiert (`@capacitor/core`, `@capacitor/cli`, `@capacitor/ios`, `@capacitor/android`, `@capacitor/haptics`)
2. ✅ `capacitor.config.ts` erstellt mit:
   - App ID: `app.lovable.2392f61b31ac4f8fa72fc2fb0001c4a7`
   - App Name: `Schluck mal!`
   - Hot-Reload für Entwicklung konfiguriert
3. ✅ Native Haptic Feedback implementiert (`src/utils/haptics.ts`)
4. ✅ Swipe-Gesten nutzen jetzt natives Haptic Feedback

## 📱 Nächste Schritte (für dich)

### Voraussetzungen
- **Für iOS**: Mac mit Xcode installiert
- **Für Android**: Android Studio installiert
- **Beide**: Node.js und Git

### Setup-Anleitung

#### 1. Projekt zu GitHub exportieren
1. In Lovable: Klick auf "Export to GitHub" Button
2. Repository erstellen und verbinden
3. Projekt auf deinen Computer klonen:
```bash
git clone [dein-repository-url]
cd schluck-mal-game
```

#### 2. Dependencies installieren
```bash
npm install
```

#### 3. iOS Setup (nur auf Mac)
```bash
# iOS Platform hinzufügen
npx cap add ios

# Projekt bauen
npm run build

# Sync zu iOS
npx cap sync ios

# Xcode öffnen
npx cap open ios
```

**In Xcode:**
1. Wähle dein Team unter "Signing & Capabilities"
2. Verbinde dein iPhone oder wähle einen Simulator
3. Klicke auf den Play-Button zum Starten

#### 4. Android Setup
```bash
# Android Platform hinzufügen
npx cap add android

# Projekt bauen
npm run build

# Sync zu Android
npx cap sync android

# Android Studio öffnen
npx cap open android
```

**In Android Studio:**
1. Warte bis Gradle sync abgeschlossen ist
2. Verbinde dein Android-Gerät oder starte einen Emulator
3. Klicke auf den Play-Button zum Starten

#### 5. Nach Code-Änderungen
Immer wenn du Code änderst:
```bash
# Projekt neu bauen und zu nativen Plattformen synchen
npm run build
npx cap sync

# Oder für iOS:
npx cap sync ios

# Oder für Android:
npx cap sync android
```

## 🚀 App Store Vorbereitung

### iOS App Store

**Voraussetzungen:**
- Apple Developer Account ($99/Jahr)
- Mac mit Xcode

**Schritte:**
1. App Icons erstellen (1024x1024px)
2. Screenshots für alle Gerätegrößen
3. In Xcode: Product → Archive
4. App Store Connect konfigurieren
5. App zur Review einreichen

**Benötigte Materialien:**
- App-Name: "Schluck mal!"
- Beschreibung (Deutsch)
- Keywords
- Support-URL
- Privacy Policy

### Google Play Store

**Voraussetzungen:**
- Google Play Developer Account ($25 einmalig)
- Android Studio

**Schritte:**
1. App Icons erstellen (512x512px)
2. Feature Graphic (1024x500px)
3. Screenshots für verschiedene Geräte
4. In Android Studio: Build → Generate Signed Bundle
5. Google Play Console konfigurieren
6. App zur Review einreichen

**Benötigte Materialien:**
- App-Name: "Schluck mal!"
- Kurzbeschreibung (max 80 Zeichen)
- Vollständige Beschreibung
- App-Kategorie: Games / Cards
- Alterseinstufung: 18+ (Alkohol-Thema!)
- Privacy Policy

## 🎨 App Icons & Assets

### Empfohlenes Tool
```bash
npm install -g @capacitor/assets
```

Erstelle einen `assets` Ordner mit:
- `icon.png` (1024x1024px)
- `splash.png` (2732x2732px)

Dann:
```bash
npx capacitor-assets generate
```

Dies generiert automatisch alle benötigten Icon- und Splash-Screen-Größen.

## 🔧 Wichtige Befehle

```bash
# App bauen und syncen
npm run build && npx cap sync

# iOS öffnen
npx cap open ios

# Android öffnen
npx cap open android

# Native Projekte updaten
npx cap update

# Capacitor plugins auflisten
npx cap ls
```

## ⚠️ Wichtige Hinweise

1. **Hot-Reload**: Während der Entwicklung lädt die App direkt von der Lovable-URL. Für Production musst du `server` aus `capacitor.config.ts` entfernen!

2. **Permissions**: Die App nutzt Vibration/Haptics. Diese Permission ist bereits konfiguriert.

3. **Alterseinstufung**: Da es ein Trinkspiel ist, MUSS die App als 18+ markiert werden!

4. **Privacy Policy**: Vor App Store/Play Store Veröffentlichung benötigst du eine Privacy Policy URL.

5. **Testing**: Teste die App gründlich auf echten Geräten, nicht nur im Simulator/Emulator!

## 📚 Weitere Ressourcen

- [Capacitor Dokumentation](https://capacitorjs.com/docs)
- [iOS Deployment Guide](https://capacitorjs.com/docs/ios)
- [Android Deployment Guide](https://capacitorjs.com/docs/android)
- [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Google Play Policies](https://play.google.com/about/developer-content-policy/)

## 🆘 Häufige Probleme

**"Pod install failed" (iOS)**
```bash
cd ios/App
pod install
cd ../..
```

**"Gradle sync failed" (Android)**
- Stelle sicher, dass Android Studio auf dem neuesten Stand ist
- File → Invalidate Caches → Restart

**App startet nicht**
```bash
# Alles neu bauen
npm run build
npx cap sync
# Dann in Xcode/Android Studio: Clean Build
```

---

Viel Erfolg mit deiner App! 🎉🍻
