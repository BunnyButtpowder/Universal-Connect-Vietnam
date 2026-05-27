# Dừng mọi tiến trình đang LISTEN trên cổng 3000 (BE mặc định).
# Đóng terminal không luôn kill Node — chạy script này khi cần tắt hẳn BE.

$ErrorActionPreference = 'SilentlyContinue'
$listeners = Get-NetTCPConnection -LocalPort 3000 -State Listen
if (-not $listeners) {
    Write-Host "Không có gì đang LISTEN trên cổng 3000."
    exit 0
}
$pids = $listeners | Select-Object -ExpandProperty OwningProcess -Unique
foreach ($procId in $pids) {
    $p = Get-Process -Id $procId -ErrorAction SilentlyContinue
    if ($p) {
        Write-Host "Đang dừng PID $procId ($($p.ProcessName)) ..."
        Stop-Process -Id $procId -Force
    }
}
Write-Host "Xong. Kiểm tra: netstat -ano | findstr `:3000"
