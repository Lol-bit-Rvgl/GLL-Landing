<#
  sync-gll-assets.ps1 — Landing-GLL
  ---------------------------------------------------------------------------
  Sincroniza los assets del reproductor GLL (Windows Media Player) dentro de
  public/images:

    gll-player.gif : animación original "Windows Media Player GLL" (GLL.gif)
    gll-player.jpg : póster estático (primer fotograma del GIF)
    gll-banner.gif : banner animado. Se toma preferentemente
                     lv_0_20260920233122.gif (o cualquier lv_0_*.gif) desde
                     Descargas / raíz; si no existe, usa GLL.gif.

  Uso:
      npm run gll:assets
      powershell -NoProfile -ExecutionPolicy Bypass -File scripts\sync-gll-assets.ps1
#>
[CmdletBinding()]
param(
    [string]$ProjectRoot  = '',
    [string]$PreferredGif = 'lv_0_20260920233122.gif',
    [string]$PlayerGif    = 'GLL.gif'
)

if (-not $ProjectRoot) {
    if ($PSScriptRoot) {
        $ProjectRoot = Split-Path -Parent $PSScriptRoot
    } elseif ($MyInvocation.MyCommand.Path) {
        $ProjectRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
    } else {
        $ProjectRoot = (Get-Location).Path
    }
}

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

$imagesDir = Join-Path $ProjectRoot 'public\images'
$excluded  = '^(node_modules|AppData|\$RECYCLE\.BIN|Recovery|System Volume Information|\.git|\.next|npm-cache|Windows|Program Files|Program Files \(x86\))$'

# Carpetas de búsqueda: descargas y raíces (usuario, perfil y disco D:)
$searchDirs = @(
    (Join-Path $env:USERPROFILE 'Downloads'),
    (Join-Path $env:USERPROFILE 'Descargas'),
    $env:USERPROFILE,
    (Join-Path $env:USERPROFILE 'Desktop'),
    'D:\Descargas',
    'D:\'
) | Where-Object { $_ -and (Test-Path $_) } | Select-Object -Unique

function Get-Candidates {
    param([string]$Dir, [string]$Filter)
    $found = @(Get-ChildItem -Path $Dir -File -Force -Filter $Filter -ErrorAction SilentlyContinue)
    $subs  = @(Get-ChildItem -Path $Dir -Directory -Force -ErrorAction SilentlyContinue |
               Where-Object { $_.Name -notmatch $excluded })
    foreach ($sub in $subs) {
        $found += @(Get-ChildItem -Path $sub.FullName -File -Force -Filter $Filter -ErrorAction SilentlyContinue)
        $grand = @(Get-ChildItem -Path $sub.FullName -Directory -Force -ErrorAction SilentlyContinue |
                   Where-Object { $_.Name -notmatch $excluded })
        foreach ($g in $grand) {
            $found += @(Get-ChildItem -Path $g.FullName -File -Force -Filter $Filter -ErrorAction SilentlyContinue)
        }
    }
    return $found
}

function Find-Asset {
    param([string]$Name)
    foreach ($dir in $searchDirs) {
        $hit = Get-Candidates -Dir $dir -Filter $Name | Sort-Object LastWriteTime -Descending | Select-Object -First 1
        if ($hit) { return $hit.FullName }
    }
    return $null
}

function Get-ImageInfo {
    param([string]$Path)
    $img = [System.Drawing.Image]::FromFile($Path)
    $dim = New-Object System.Drawing.Imaging.FrameDimension $img.FrameDimensionsList[0]
    $frames = $img.GetFrameCount($dim)
    $info = [pscustomobject]@{ Width = $img.Width; Height = $img.Height; Frames = $frames }
    $img.Dispose()
    return $info
}

New-Item -ItemType Directory -Force -Path $imagesDir | Out-Null

Write-Host ''
Write-Host '=== Busqueda de fuentes ===' -ForegroundColor Cyan
Write-Host ("Carpetas analizadas: {0}" -f ($searchDirs -join ' | '))

$bannerSrc = Find-Asset -Name $PreferredGif
if (-not $bannerSrc) { $bannerSrc = Find-Asset -Name 'lv_0_*.gif' }

$playerSrc = Find-Asset -Name $PlayerGif
if (-not $playerSrc) { $playerSrc = $bannerSrc }

foreach ($item in @(
    @{ Label = $PreferredGif;          Value = $bannerSrc },
    @{ Label = "$PlayerGif (WMP GLL)"; Value = $playerSrc }
)) {
    if ($item.Value) {
        Write-Host ("[OK]    {0,-30} -> {1}" -f $item.Label, $item.Value) -ForegroundColor Green
    } else {
        Write-Host ("[FALTA] {0,-30} -> no encontrado" -f $item.Label) -ForegroundColor Yellow
    }
}

if (-not $playerSrc -and -not $bannerSrc) {
    Write-Host 'No se encontro ningun GIF fuente; nada que sincronizar.' -ForegroundColor Red
    exit 1
}

# gll-player.gif y gll-banner.gif (el banner usa el GIF dedicado si existe)
Copy-Item -LiteralPath $playerSrc -Destination (Join-Path $imagesDir 'gll-player.gif') -Force
$bannerUse = if ($bannerSrc) { $bannerSrc } else { $playerSrc }
Copy-Item -LiteralPath $bannerUse -Destination (Join-Path $imagesDir 'gll-banner.gif') -Force

# gll-player.jpg = primer fotograma del GIF del reproductor (póster estático)
$playerGifPath = Join-Path $imagesDir 'gll-player.gif'
$source   = [System.Drawing.Image]::FromFile($playerGifPath)
$frameDim = New-Object System.Drawing.Imaging.FrameDimension $source.FrameDimensionsList[0]
$source.SelectActiveFrame($frameDim, 0) | Out-Null
$poster = New-Object System.Drawing.Bitmap $source
$jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() |
             Where-Object { $_.MimeType -eq 'image/jpeg' } | Select-Object -First 1
$encoderParams = New-Object System.Drawing.Imaging.EncoderParameters 1
$encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter(
    [System.Drawing.Imaging.Encoder]::Quality, [long]92)
$poster.Save((Join-Path $imagesDir 'gll-player.jpg'), $jpegCodec, $encoderParams)
$encoderParams.Dispose()
$poster.Dispose()
$source.Dispose()

Write-Host ''
Write-Host '=== Verificacion en public/images ===' -ForegroundColor Cyan
foreach ($name in @('gll-player.gif', 'gll-player.jpg', 'gll-banner.gif')) {
    $path = Join-Path $imagesDir $name
    if (Test-Path -LiteralPath $path) {
        $file = Get-Item -LiteralPath $path
        $hash = (Get-FileHash -LiteralPath $path -Algorithm SHA256).Hash
        $info = Get-ImageInfo -Path $path
        Write-Host ("[OK] {0,-15} {1,9:N0} bytes  {2}x{3}  frames={4}  sha256={5}" -f `
            $name, $file.Length, $info.Width, $info.Height, $info.Frames, $hash.Substring(0, 16)) -ForegroundColor Green
        Write-Host ("     ruta     : {0}" -f $file.FullName)
        Write-Host ("     url Next : /images/{0}" -f $name)
    } else {
        Write-Host ("[FALTA] {0}" -f $path) -ForegroundColor Red
    }
}
Write-Host ''

