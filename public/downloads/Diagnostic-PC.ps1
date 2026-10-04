<#
.SYNOPSIS
    Diagnostic-PC.ps1 - Diagnostic + corrections automatiques - 3WM Service

.DESCRIPTION
    Analyse l'etat general d'un PC Windows : antivirus, mises a jour Windows,
    espace disque, programmes au demarrage, memoire, redemarrage en attente,
    evenements systeme recents. Calcule un score de sante sur 100 et genere
    un rapport texte sur le Bureau.

    Si des problemes sont detectes, le script peut ensuite proposer de les
    corriger. CHAQUE correction est demandee INDIVIDUELLEMENT (Voulez-vous
    corriger : ... ? O/N) : rien n'est modifie sans un accord explicite et
    separe pour cette correction precise.

    Ce script NE REDEMARRE JAMAIS l'ordinateur automatiquement. Si un
    redemarrage est necessaire (mises a jour installees, etc.), le rapport
    l'indique clairement et c'est a l'utilisateur de le faire quand il le
    souhaite.

    A UTILISER UNIQUEMENT apres l'accord explicite du client, pendant une
    session d'assistance a distance (AnyDesk).

.NOTES
    3WM Service - https://3-wm.net
    Compatible Windows PowerShell 5.1 et PowerShell 7+.
    Certaines corrections (mises a jour, nettoyage complet) necessitent que
    le script soit lance en tant qu'administrateur.
#>

# ============================================================
#  Etape 1 - Consentement explicite avant toute analyse
# ============================================================
Write-Host ""
Write-Host "======================================================" -ForegroundColor Cyan
Write-Host "   3WM Service - Diagnostic PC" -ForegroundColor Cyan
Write-Host "======================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Ce script va analyser votre ordinateur : antivirus, mises a jour,"
Write-Host "espace disque, programmes au demarrage, memoire, evenements recents..."
Write-Host ""
Write-Host "L'analyse elle-meme ne modifie rien. Si des problemes sont trouves," -ForegroundColor Yellow
Write-Host "des corrections pourront ensuite etre proposees UNE PAR UNE, avec" -ForegroundColor Yellow
Write-Host "votre accord explicite a chaque fois." -ForegroundColor Yellow
Write-Host ""

$confirmation = Read-Host "Confirmez-vous vouloir lancer ce diagnostic ? (O/N)"
if ($confirmation -notmatch '^[OoYy]') {
    Write-Host ""
    Write-Host "Diagnostic annule a la demande de l'utilisateur. Aucune action effectuee." -ForegroundColor Yellow
    exit
}

Write-Host ""
Write-Host "Diagnostic en cours, merci de patienter (environ 1 minute)..." -ForegroundColor Green
Write-Host ""

$report = [System.Collections.Generic.List[string]]::new()
$issues = [System.Collections.Generic.List[hashtable]]::new()
$score = 100
$dateDiag = Get-Date -Format "dd/MM/yyyy HH:mm"

$isAdmin = $false
try {
    $isAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
} catch { }

function Add-Line {
    param([string]$Text)
    Write-Host $Text
    $report.Add($Text)
}

Add-Line "3WM Service - Rapport de diagnostic PC"
Add-Line "Genere le : $dateDiag"
Add-Line "Ordinateur : $env:COMPUTERNAME"
Add-Line "Lance en administrateur : $(if ($isAdmin) { 'oui' } else { 'non' })"
Add-Line "Consentement client confirme avant l'analyse : oui"
Add-Line "======================================================"

if (-not $isAdmin) {
    Add-Line ""
    Add-Line "Remarque : ce script n'est pas lance en tant qu'administrateur."
    Add-Line "Certaines corrections (mises a jour, nettoyage complet) pourront echouer."
}

# ============================================================
#  Systeme
# ============================================================
Add-Line ""
Add-Line "--- Systeme ---"
try {
    $os = Get-CimInstance Win32_OperatingSystem -ErrorAction Stop
    Add-Line ("Windows : {0} (build {1})" -f $os.Caption, $os.BuildNumber)
    $uptime = (Get-Date) - $os.LastBootUpTime
    Add-Line ("Allume depuis : {0} jour(s), {1} h" -f $uptime.Days, $uptime.Hours)
} catch {
    Add-Line "Impossible de recuperer les informations systeme."
}

# ============================================================
#  Antivirus
# ============================================================
Add-Line ""
Add-Line "--- Antivirus ---"
try {
    $av = Get-MpComputerStatus -ErrorAction Stop
    $avState = if ($av.AntivirusEnabled) { "Actif" } else { "INACTIF" }
    Add-Line "Windows Defender : $avState"
    if ($av.AntivirusSignatureLastUpdated) {
        $sigAge = (Get-Date) - $av.AntivirusSignatureLastUpdated
        Add-Line ("Definitions de virus mises a jour il y a : {0} jour(s)" -f [Math]::Round($sigAge.TotalDays, 1))
        if ($sigAge.TotalDays -gt 7) { $score -= 10 }
    }
    if (-not $av.AntivirusEnabled) {
        $score -= 25
        $issues.Add(@{
            Description = "Activer la protection en temps reel de Windows Defender"
            Action = {
                Set-MpPreference -DisableRealtimeMonitoring $false -ErrorAction Stop
                "Protection en temps reel de Windows Defender activee."
            }.GetNewClosure()
        })
    }
} catch {
    try {
        $avList = Get-CimInstance -Namespace "root\SecurityCenter2" -ClassName AntivirusProduct -ErrorAction Stop
        if ($avList) {
            foreach ($a in $avList) { Add-Line ("Antivirus detecte : {0}" -f $a.displayName) }
        } else {
            Add-Line "Aucun antivirus detecte."
            $score -= 25
        }
    } catch {
        Add-Line "Statut antivirus non accessible sur ce systeme (droits insuffisants ou service indisponible)."
    }
}

# ============================================================
#  Mises a jour Windows
# ============================================================
Add-Line ""
Add-Line "--- Mises a jour Windows ---"
try {
    $updateSession = New-Object -ComObject Microsoft.Update.Session
    $searcher = $updateSession.CreateUpdateSearcher()
    $pendingUpdates = $searcher.Search("IsInstalled=0 and Type='Software'")
    $updateCount = $pendingUpdates.Updates.Count
    if ($updateCount -eq 0) {
        Add-Line "Aucune mise a jour en attente."
    } else {
        Add-Line "$updateCount mise(s) a jour en attente d'installation."
        $score -= [Math]::Min(20, $updateCount * 3)
        $issues.Add(@{
            Description = "Installer les $updateCount mise(s) a jour Windows en attente (necessite les droits administrateur)"
            Action = {
                $downloader = $updateSession.CreateUpdateDownloader()
                $downloader.Updates = $pendingUpdates.Updates
                $downloader.Download() | Out-Null
                $installer = $updateSession.CreateUpdateInstaller()
                $installer.Updates = $pendingUpdates.Updates
                $installResult = $installer.Install()
                if ($installResult.RebootRequired) {
                    "Mises a jour installees. Un redemarrage sera necessaire (a faire vous-meme, quand vous le souhaitez)."
                } else {
                    "Mises a jour installees avec succes."
                }
            }.GetNewClosure()
        })
    }
} catch {
    Add-Line "Impossible de verifier les mises a jour Windows (droits ou service Windows Update indisponible)."
}

# ============================================================
#  Espace disque
# ============================================================
Add-Line ""
Add-Line "--- Espace disque ---"
try {
    $disks = Get-CimInstance Win32_LogicalDisk -Filter "DriveType=3" -ErrorAction Stop
    foreach ($d in $disks) {
        if ($d.Size -gt 0) {
            $freeGB = [Math]::Round($d.FreeSpace / 1GB, 1)
            $totalGB = [Math]::Round($d.Size / 1GB, 1)
            $freePct = [Math]::Round(($d.FreeSpace / $d.Size) * 100)
            Add-Line ("Disque {0} : {1} Go libres sur {2} Go ({3}%)" -f $d.DeviceID, $freeGB, $totalGB, $freePct)
            if ($freePct -lt 10) { $score -= 15 }
            elseif ($freePct -lt 20) { $score -= 5 }

            if ($freePct -lt 20 -and $d.DeviceID -eq $env:SystemDrive) {
                $issues.Add(@{
                    Description = "Nettoyer les fichiers temporaires et vider la corbeille (disque $($d.DeviceID))"
                    Action = {
                        $cleaned = [System.Collections.Generic.List[string]]::new()
                        try {
                            Clear-RecycleBin -DriveLetter $env:SystemDrive.Substring(0, 1) -Force -ErrorAction Stop
                            $cleaned.Add("corbeille")
                        } catch { }
                        try {
                            Get-ChildItem -Path $env:TEMP -Force -ErrorAction SilentlyContinue |
                                Remove-Item -Recurse -Force -ErrorAction SilentlyContinue
                            $cleaned.Add("fichiers temporaires utilisateur")
                        } catch { }
                        try {
                            Get-ChildItem -Path "$env:WINDIR\Temp" -Force -ErrorAction SilentlyContinue |
                                Remove-Item -Recurse -Force -ErrorAction SilentlyContinue
                            $cleaned.Add("fichiers temporaires Windows")
                        } catch { }
                        if ($cleaned.Count -gt 0) {
                            "Nettoyage effectue : " + ($cleaned -join ", ") + "."
                        } else {
                            "Aucun element n'a pu etre nettoye (droits insuffisants)."
                        }
                    }.GetNewClosure()
                })
            }
        }
    }
} catch {
    Add-Line "Impossible de lire l'espace disque."
}

# ============================================================
#  Programmes au demarrage
# ============================================================
Add-Line ""
Add-Line "--- Demarrage ---"
try {
    $startup = Get-CimInstance Win32_StartupCommand -ErrorAction Stop
    $startupCount = ($startup | Measure-Object).Count
    Add-Line "$startupCount programme(s) se lancent au demarrage de Windows."
    if ($startupCount -gt 15) { $score -= 10 }
    elseif ($startupCount -gt 8) { $score -= 5 }
    if ($startupCount -gt 8) {
        Add-Line "(Pas de correction automatique ici : desactiver le mauvais programme peut gener d'autres logiciels. A revoir manuellement avec le client si besoin.)"
    }
} catch {
    Add-Line "Impossible de lire la liste des programmes au demarrage."
}

# ============================================================
#  Memoire
# ============================================================
Add-Line ""
Add-Line "--- Memoire ---"
try {
    $os = Get-CimInstance Win32_OperatingSystem -ErrorAction Stop
    $totalRAM = [Math]::Round($os.TotalVisibleMemorySize / 1MB, 1)
    $freeRAM = [Math]::Round($os.FreePhysicalMemory / 1MB, 1)
    $usedPct = [Math]::Round((1 - ($os.FreePhysicalMemory / $os.TotalVisibleMemorySize)) * 100)
    Add-Line ("RAM : {0} Go utilises sur {1} Go ({2}%)" -f ($totalRAM - $freeRAM), $totalRAM, $usedPct)
    if ($usedPct -gt 90) { $score -= 10 }
} catch {
    Add-Line "Impossible de lire l'utilisation memoire."
}

# ============================================================
#  Redemarrage en attente
# ============================================================
Add-Line ""
Add-Line "--- Redemarrage ---"
$pendingReboot = $false
if (Test-Path "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Component Based Servicing\RebootPending") { $pendingReboot = $true }
if (Test-Path "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\WindowsUpdate\Auto Update\RebootRequired") { $pendingReboot = $true }
if ($pendingReboot) {
    Add-Line "Un redemarrage est en attente pour finaliser des mises a jour."
    Add-Line "(Ce script ne redemarre jamais automatiquement : a faire vous-meme quand vous le souhaitez.)"
    $score -= 5
} else {
    Add-Line "Aucun redemarrage en attente."
}

# ============================================================
#  Evenements systeme recents (erreurs / avertissements critiques)
# ============================================================
Add-Line ""
Add-Line "--- Evenements recents (48h) ---"
try {
    $since = (Get-Date).AddHours(-48)
    $errors = Get-WinEvent -FilterHashtable @{LogName = 'System'; Level = 1, 2; StartTime = $since } -ErrorAction SilentlyContinue
    $errCount = ($errors | Measure-Object).Count
    Add-Line "$errCount erreur(s)/avertissement(s) critique(s) dans le journal systeme."
    if ($errCount -gt 20) { $score -= 10 }
} catch {
    Add-Line "Aucun evenement critique recent (ou journal inaccessible)."
}

# ============================================================
#  Score de diagnostic
# ============================================================
$score = [Math]::Max(0, [Math]::Min(100, $score))

Add-Line ""
Add-Line "======================================================"
Add-Line "SCORE DE SANTE DU PC : $score / 100"
Add-Line "======================================================"

# ============================================================
#  Etape 2 - Corrections proposees UNE PAR UNE
# ============================================================
$fixedCount = 0
if ($issues.Count -gt 0) {
    Add-Line ""
    Add-Line "======================================================"
    Add-Line "CORRECTIONS PROPOSEES"
    Add-Line "======================================================"

    Write-Host ""
    Write-Host "======================================================" -ForegroundColor Cyan
    Write-Host "$($issues.Count) probleme(s) peuvent etre corrige(s)." -ForegroundColor Cyan
    Write-Host "Chaque correction est demandee individuellement." -ForegroundColor Cyan
    Write-Host "======================================================" -ForegroundColor Cyan

    foreach ($issue in $issues) {
        Write-Host ""
        $reponse = Read-Host "Voulez-vous corriger : $($issue.Description) ? (O/N)"
        if ($reponse -match '^[OoYy]') {
            Add-Line ""
            Add-Line "Correction demandee et acceptee : $($issue.Description)"
            try {
                $resultMsg = & $issue.Action
                Add-Line "  -> Resultat : $resultMsg"
                Write-Host "  OK : $resultMsg" -ForegroundColor Green
                $fixedCount++
            } catch {
                Add-Line "  -> Echec : $($_.Exception.Message)"
                Write-Host "  Echec : $($_.Exception.Message)" -ForegroundColor Red
            }
        } else {
            Add-Line ""
            Add-Line "Correction refusee par l'utilisateur : $($issue.Description)"
            Write-Host "  Ignore." -ForegroundColor Yellow
        }
    }

    Add-Line ""
    Add-Line "======================================================"
    Add-Line "$fixedCount correction(s) appliquee(s) sur $($issues.Count) proposee(s)."
    Add-Line "======================================================"
} else {
    Add-Line ""
    Add-Line "Aucun probleme necessitant une correction automatique n'a ete detecte."
}

Add-Line ""
Add-Line "Aucune action n'a ete effectuee sans accord explicite de l'utilisateur."

# ============================================================
#  Export du rapport
# ============================================================
$desktop = [Environment]::GetFolderPath("Desktop")
$fileName = "Diagnostic-PC_{0}.txt" -f (Get-Date -Format 'yyyy-MM-dd_HHmm')
$filePath = Join-Path $desktop $fileName
$report | Out-File -FilePath $filePath -Encoding UTF8

Write-Host ""
Write-Host "Rapport enregistre sur le Bureau : $fileName" -ForegroundColor Green
if ($fixedCount -gt 0) {
    Write-Host "$fixedCount correction(s) ont ete appliquees avec votre accord." -ForegroundColor Cyan
}
Write-Host ""
Write-Host "Diagnostic termine." -ForegroundColor Cyan
