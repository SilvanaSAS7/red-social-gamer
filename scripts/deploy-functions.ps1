<#
Deploy helper para Firebase Functions (Livepeer bridge)

Uso:
  .\scripts\deploy-functions.ps1                # te irá preguntando datos
  .\scripts\deploy-functions.ps1 -ProjectId your-firebase-project -LivepeerKey lp_test_xxx

Qué hace:
- Verifica que exista la carpeta functions
- Instala dependencias en functions si es necesario (npm install)
- (Opcional) instala firebase-tools globalmente si no está disponible
- Configura la clave Livepeer en functions config: livepeer.key
- (Opcional) cambia el proyecto con `firebase use` si indicas ProjectId
- Realiza `firebase deploy --only functions`

Notas:
- Este script asume que estás en Windows PowerShell (no PowerShell Core exclusivo).
- No realiza `firebase login` por razones de seguridad: inicia sesión antes con `firebase login`.
#>

param(
  [string]$ProjectId,
  [string]$LivepeerKey
)

function Write-ErrAndExit($msg) {
  Write-Host "ERROR: $msg" -ForegroundColor Red
  exit 1
}

$root = (Get-Location).Path
Write-Host "Repo root (working dir): $root"

$functionsDir = Join-Path $root 'functions'
if (-not (Test-Path $functionsDir)) {
  Write-ErrAndExit "No se encontró la carpeta 'functions' en $root. Asegúrate de ejecutar el script desde la raíz del repo."
}

Push-Location $functionsDir
try {
  # comprobar npm
  if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-ErrAndExit "npm no está disponible en PATH. Instala Node.js (incluye npm) antes de continuar."
  }

  # instalar dependencias si node_modules no existe
  if (-not (Test-Path (Join-Path $functionsDir 'node_modules'))) {
    Write-Host "Instalando dependencias en functions/... (npm install) ..." -ForegroundColor Cyan
    npm install
  } else {
    Write-Host "Dependencias ya instaladas en functions/. Saltando npm install." -ForegroundColor DarkGreen
  }

  Pop-Location

  # comprobar firebase-tools
  if (-not (Get-Command firebase -ErrorAction SilentlyContinue)) {
    Write-Host "firebase CLI no encontrada. ¿Deseas instalar firebase-tools globalmente ahora? (recomendado) [Y/n]" -ForegroundColor Yellow
    $resp = Read-Host
    if ($resp -eq '' -or $resp -match '^[Yy]') {
      Write-Host "Instalando firebase-tools globalmente..." -ForegroundColor Cyan
      npm install -g firebase-tools
    } else {
      Write-ErrAndExit "firebase CLI requerida. Instálala y rerun el script.";
    }
  } else {
    Write-Host "firebase CLI encontrada." -ForegroundColor DarkGreen
  }

  # Asegurarse que el usuario está logueado
  Write-Host "Verificando sesión de Firebase..." -ForegroundColor Cyan
  $whoami = & firebase login:list 2>$null
  if ($LASTEXITCODE -ne 0) {
    Write-Host "No parece que estés logueado en Firebase CLI. Ejecuta: firebase login" -ForegroundColor Yellow
    return
  }

  # Pedir ProjectId si no fue suministrado
  if (-not $ProjectId) {
    Write-Host "Introduce el Project ID de Firebase a usar (dejar vacío para usar el proyecto activo):" -NoNewline
    $ProjectId = Read-Host
  }
  if ($ProjectId) {
    # Trim para evitar espacios accidentales
    $ProjectId = $ProjectId.Trim()
    Write-Host "Usando projectId: $ProjectId (se lo pasaremos a los comandos de firebase)" -ForegroundColor Cyan
  } else {
    Write-Host "No se indicó projectId: los comandos de firebase usarán el proyecto activo si existe." -ForegroundColor DarkGreen
  }

  # Pedir LivepeerKey si no fue suministrada
  if (-not $LivepeerKey) {
    Write-Host "Introduce la Livepeer API Key (lp_... ) (se guardará en functions config):" -NoNewline
    $LivepeerKey = Read-Host
  }
  if (-not $LivepeerKey) {
    Write-ErrAndExit "La Livepeer API Key es obligatoria para desplegar las funciones puente.";
  }

  # Setear config
  Write-Host "Configurando livepeer.key en functions config..." -ForegroundColor Cyan
  # Pasar el projectArg si se especificó un proyecto
  if ($ProjectId) {
    firebase functions:config:set livepeer.key="$LivepeerKey" --project $ProjectId
  } else {
    firebase functions:config:set livepeer.key="$LivepeerKey"
  }
  if ($LASTEXITCODE -ne 0) {
    Write-ErrAndExit "No se pudo establecer functions config. Comprueba permisos y vuelve a intentarlo.";
  }

  # Desplegar funciones
  Write-Host "Desplegando funciones Firebase..." -ForegroundColor Cyan
  if ($ProjectId) {
    firebase deploy --only functions --project $ProjectId
  } else {
    firebase deploy --only functions
  }
  if ($LASTEXITCODE -ne 0) {
    Write-ErrAndExit "El deploy falló. Revisa la salida de firebase deploy para más detalles.";
  }

  Write-Host "Despliegue completo. Revisa Firebase Console -> Functions para ver logs/estado." -ForegroundColor Green

} finally {
  if ((Get-Location).Path -ne $root) { Pop-Location }
}
