$ErrorActionPreference = "Stop"

$Root = (Get-Location).Path
$Layout = Join-Path $Root "app\layout.tsx"
$SignIn = Join-Path $Root "app\signin\page.tsx"
$Css = Join-Path $Root "app\globals.css"

foreach ($File in @($Layout,$SignIn,$Css)) {
    if (-not (Test-Path $File)) { throw "Could not find expected file: $File`nRun this script from the VeyraRx project root." }
}

$layoutText = Get-Content $Layout -Raw
$layoutText = $layoutText.Replace(
    '<span className="brandMark">V<span>Rx</span></span><strong>VeyraRx</strong>',
    '<span className="brandMark" aria-hidden="true"><span className="brandV">V</span><span className="brandRx">Rx</span></span><strong>VeyraRx</strong>'
)
Set-Content $Layout $layoutText -Encoding UTF8

$signinText = Get-Content $SignIn -Raw
$signinText = $signinText.Replace(
    '<div className="brandMark big">V<span>Rx</span></div>',
    '<div className="brandMark big" aria-hidden="true"><span className="brandV">V</span><span className="brandRx">Rx</span></div>'
)
Set-Content $SignIn $signinText -Encoding UTF8

$cssText = Get-Content $Css -Raw
$old = '.brandMark{width:42px;height:42px;border-radius:12px;background:#0a706e;color:#fff;display:inline-grid;place-items:center;font-weight:800;letter-spacing:-2px}.brandMark span{color:#bde85f}'
$new = '.brandMark{width:44px;height:44px;border-radius:12px;background:#0a706e;color:#fff;display:inline-flex;align-items:center;justify-content:center;position:relative;font-weight:800;line-height:1;letter-spacing:0;flex:0 0 44px;overflow:hidden}.brandV{font-size:22px;transform:translateY(-1px)}.brandRx{position:absolute;right:4px;bottom:4px;font-size:9px;line-height:1;color:#d4f06a;letter-spacing:-.25px;font-weight:900;background:#0a706e;padding-left:2px}'
$cssText = $cssText.Replace($old,$new)
$cssText = $cssText.Replace(
    '.brand{display:flex;align-items:center;gap:10px;font-size:22px;margin-right:auto}',
    '.brand{display:flex;align-items:center;gap:11px;font-size:22px;margin-right:auto}.brand strong{letter-spacing:-.45px;color:#173b45}'
)
$cssText = $cssText.Replace(
    '.big{width:52px;height:52px}',
    '.big{width:54px;height:54px;flex-basis:54px}.big .brandV{font-size:27px}.big .brandRx{font-size:10px;right:5px;bottom:5px}'
)
Set-Content $Css $cssText -Encoding UTF8

Write-Host "VeyraRx logo fixed." -ForegroundColor Green
Write-Host "If npm run dev is already running, refresh the browser." -ForegroundColor Cyan
