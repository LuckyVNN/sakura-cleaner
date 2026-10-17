export const translations = {
  en: {
    appName: 'Sakura Cleaner',
    appSubtitle: 'Kawaii PC Disk Visualizer & Smart Cleaner (✿◡‿◡)',
    version: 'v1.0 ✨',
    
    // View Modes
    pieChart: 'Pie Chart 🥧',
    treemap: 'Treemap 🔲',
    list: 'List 📋',
    
    // Header actions
    refreshDrives: 'Refresh connected drives',
    smartCleanBtn: 'Smart Clean ✨',
    
    // Mascot
    mascotIdle: 'Select a drive below or click "Full Scan" to tidy up your storage!',
    mascotSweeping: 'Sweeping {path}... Found {count} files ({size})!',
    mascotFullScanSweeping: 'Full PC Scan: Sweeping Drive {index} of {total} ({drive})... Found {count} files ({size})!',
    mascotHugeFolder: 'Whoa! "{name}" is using {size}! That is a huge folder!',
    mascotScanComplete: 'Scan complete! Found {count} files totaling {size} in {time}s!',
    foldersCount: '{count} folders',
    filesCount: '{count} files',
    elapsedTime: '{time}s elapsed',
    sakuraChan: 'Sakura Chan',

    // Drive Selector
    storageDrives: 'Storage Drives',
    detectedCount: '{count} Detected',
    usedOfTotal: '• {used} used of {total} ({percent}%)',
    fullScanBtn: '⚡ Full Scan (All Disks)',
    freeOf: '{free} free of {total}',
    percentUsed: '{percent}% used',
    almostFull: 'Almost full!',
    scanSingleDrive: 'Scan only {name}',

    // Empty state
    noResultsTitle: 'No scan results yet',
    noResultsDesc: 'Click "Full Scan" or select any drive above to generate your interactive fraction chart!',
    scanDriveOnly: 'Scan {name} Only',

    // Scanning state
    scanningTitle: 'Scanning your hard drive...',
    analyzingFolders: 'Analyzing folders & file structures',
    filesFoundSoFar: '{count} files found',

    // Breadcrumbs
    root: 'Root',
    thisPC: 'This PC',

    // Pie Chart
    level: 'Level:',
    goUpBtn: 'Go Up ⬆️',
    clickSliceHint: 'Click slice to drill down',
    subfolderTitle: 'Items in this folder (Click folder to drill down):',
    noSubfolders: '"{name}" has no deeper subfolders',
    goBackUp: 'Go Back Up',
    others: 'Others ({count} items)',
    clickToDrill: '✨ Click to drill down into this folder!',
    sizeLabel: 'Size:',

    // List View
    nameAndPath: 'Name & Path ({count} items)',
    proportion: 'Proportion',
    actions: 'Actions',
    itemsCount: '{count} items',

    // Item Details
    nothingSelected: 'Nothing Selected',
    nothingSelectedDesc: 'Click any chart slice or list item to view details & clean options.',
    folderType: 'Folder',
    occupiedSpace: 'Occupied Space',
    topLevelEntries: 'Contains {count} top-level entries',
    location: 'LOCATION',
    copied: 'Copied!',
    copy: 'Copy',
    revealExplorer: 'Reveal in File Explorer',
    sendRecycleBin: 'Send to Recycle Bin',
    confirmTrashTitle: 'Send to Recycle Bin?',
    confirmTrashDesc: 'This will move the selected item to your Windows Recycle Bin.',
    yesSendTrash: 'Yes, Send to Trash 🗑️',
    cancel: 'Cancel',

    // Smart Clean Modal
    smartCleanTitle: 'Smart Cleaner',
    safePresetsBadge: 'Safe Presets',
    smartCleanSubtitle: 'Purge safe temporary files, caches, and reclaim precious disk space!',
    detectedJunk: 'Detected Junk Categories',
    selectAllSafe: 'Select All Safe',
    scanningJunk: 'Scanning junk caches...',
    cleanWithLove: 'Clean with Love 💖',
    cleaningProgress: 'Cleaning...',
    close: 'Close',
    reclaimableSpace: 'Reclaimable Space',
    cleanSuccessTitle: 'Yay! Successfully cleaned {size}!',
    cleanSuccessSubtitle: 'Your PC is lighter and happier (✿◠‿◠)',
    safeBadge: 'Safe',
    reviewBadge: 'Review',

    // Toasts
    scanCompletedToast: 'Scan complete! (ﾉ◕ヮ◕)ﾉ*:･ﾟ✧',
    openedExplorerToast: 'Opened in File Explorer 📂',
    sentToTrashToast: 'Sent "{name}" to Recycle Bin 🗑️',
    cleanSuccessToast: 'Smart Clean complete! 🎉',
    errorToast: 'Error: {msg}',

    // Info & About Modal
    infoBtn: 'About & Info (i)',
    aboutTitle: 'About Sakura Cleaner',
    aboutSubtitle: 'Cute Pink PC Disk Visualizer & Smart Cleaner',
    authorTitle: 'Author / Creator',
    authorName: 'Sakura Dev',
    amaTitle: 'AMA / Questions & Feedback',
    amaText: 'Got any questions, feedback, or feature requests? Feel free to ask anytime! (✿◠‿◠)',
    techStackTitle: 'Built With',
    techStackText: 'Electron 33 • React 18 • Apache ECharts • Tailwind CSS • Node.js',
    licenseTitle: 'License',
    licenseText: 'MIT License • Free & Open Source',
    safeRecycleNote: 'Safety guarantee: Files are moved to Windows Recycle Bin and can be restored anytime.',
    githubRepoBtn: 'GitHub Repo 🐙',
    latestReleasesBtn: 'Releases & Exe 🚀'
  },

  vi: {
    appName: 'Sakura Cleaner',
    appSubtitle: 'Trình trực quan hóa & dọn dẹp ổ đĩa siêu dễ thương (✿◡‿◡)',
    version: 'v1.0 ✨',
    
    // View Modes
    pieChart: 'Biểu đồ tròn 🥧',
    treemap: 'Bản đồ cây 🔲',
    list: 'Danh sách 📋',
    
    // Header actions
    refreshDrives: 'Làm mới danh sách ổ đĩa',
    smartCleanBtn: 'Dọn thông minh ✨',
    
    // Mascot
    mascotIdle: 'Chọn một ổ đĩa bên dưới hoặc bấm "Quét toàn bộ" để dọn dẹp nhé!',
    mascotSweeping: 'Đang dọn dẹp {path}... Đã tìm thấy {count} tập tin ({size})!',
    mascotFullScanSweeping: 'Quét toàn bộ PC: Đang quét ổ {index}/{total} ({drive})... Đã tìm {count} tập tin ({size})!',
    mascotHugeFolder: 'Ối! Thư mục "{name}" chiếm tới {size}! Nặng quá nè!',
    mascotScanComplete: 'Quét xong rồi! Tìm thấy {count} tập tin với tổng dung lượng {size} trong {time}s!',
    foldersCount: '{count} thư mục',
    filesCount: '{count} tập tin',
    elapsedTime: 'Đã trôi qua {time}s',
    sakuraChan: 'Sakura Chan',

    // Drive Selector
    storageDrives: 'Ổ lưu trữ',
    detectedCount: 'Đã phát hiện {count} ổ',
    usedOfTotal: '• Đã dùng {used} trên {total} ({percent}%)',
    fullScanBtn: '⚡ Quét toàn bộ PC (Tất cả ổ)',
    freeOf: 'Còn trống {free} trên {total}',
    percentUsed: 'Đã dùng {percent}%',
    almostFull: 'Sắp đầy rồi!',
    scanSingleDrive: 'Chỉ quét ổ {name}',

    // Empty state
    noResultsTitle: 'Chưa có kết quả quét',
    noResultsDesc: 'Bấm "Quét toàn bộ PC" hoặc chọn một ổ đĩa phía trên để tạo biểu đồ trực quan!',
    scanDriveOnly: 'Chỉ quét ổ {name}',

    // Scanning state
    scanningTitle: 'Đang quét ổ đĩa máy tính...',
    analyzingFolders: 'Đang phân tích cấu trúc thư mục & tập tin',
    filesFoundSoFar: 'Đã tìm thấy {count} tập tin',

    // Breadcrumbs
    root: 'Gốc',
    thisPC: 'Máy tính này (This PC)',

    // Pie Chart
    level: 'Thư mục:',
    goUpBtn: 'Lên trên ⬆️',
    clickSliceHint: 'Bấm vào phần tử để phóng to',
    subfolderTitle: 'Các mục bên trong (Bấm vào thư mục để xem chi tiết):',
    noSubfolders: 'Thư mục "{name}" không có thư mục con nào sâu hơn',
    goBackUp: 'Quay lại thư mục cha',
    others: 'Mục khác ({count} phần tử)',
    clickToDrill: '✨ Bấm để xem chi tiết bên trong thư mục này!',
    sizeLabel: 'Kích thước:',

    // List View
    nameAndPath: 'Tên & Đường dẫn ({count} mục)',
    proportion: 'Tỉ lệ',
    actions: 'Thao tác',
    itemsCount: '{count} mục',

    // Item Details
    nothingSelected: 'Chưa chọn mục nào',
    nothingSelectedDesc: 'Bấm vào bất kỳ lát cắt biểu đồ hoặc danh sách để xem chi tiết & dọn dẹp.',
    folderType: 'Thư mục',
    occupiedSpace: 'Dung lượng chiếm dụng',
    topLevelEntries: 'Chứa {count} mục cấp 1',
    location: 'ĐƯỜNG DẪN',
    copied: 'Đã chép!',
    copy: 'Sao chép',
    revealExplorer: 'Mở trong File Explorer',
    sendRecycleBin: 'Bỏ vào Thùng rác',
    confirmTrashTitle: 'Chuyển vào Thùng rác?',
    confirmTrashDesc: 'Thao tác này sẽ chuyển mục đã chọn vào Thùng rác (Recycle Bin) của Windows.',
    yesSendTrash: 'Đúng, bỏ vào Thùng rác 🗑️',
    cancel: 'Hủy',

    // Smart Clean Modal
    smartCleanTitle: 'Dọn dẹp thông minh',
    safePresetsBadge: 'Mục an toàn',
    smartCleanSubtitle: 'Xóa các tập tin tạm thời, bộ nhớ đệm an toàn và giải phóng dung lượng quý giá!',
    detectedJunk: 'Các danh mục rác phát hiện được',
    selectAllSafe: 'Chọn tất cả mục an toàn',
    scanningJunk: 'Đang quét bộ nhớ đệm rác...',
    cleanWithLove: 'Dọn sạch với yêu thương 💖',
    cleaningProgress: 'Đang dọn dẹp...',
    close: 'Đóng',
    reclaimableSpace: 'Dung lượng có thể giải phóng',
    cleanSuccessTitle: 'Tuyệt vời! Đã dọn sạch thành công {size}!',
    cleanSuccessSubtitle: 'Máy tính của bạn giờ nhẹ nhàng và vui vẻ hơn rồi đó (✿◠‿◠)',
    safeBadge: 'An toàn',
    reviewBadge: 'Xem lại',

    // Toasts
    scanCompletedToast: 'Quét hoàn tất! (ﾉ◕ヮ◕)ﾉ*:･ﾟ✧',
    openedExplorerToast: 'Đã mở trong File Explorer 📂',
    sentToTrashToast: 'Đã chuyển "{name}" vào Thùng rác 🗑️',
    cleanSuccessToast: 'Dọn dẹp thông minh hoàn tất! 🎉',
    errorToast: 'Lỗi: {msg}',

    // Info & About Modal
    infoBtn: 'Thông tin & Tác giả (i)',
    aboutTitle: 'Giới thiệu Sakura Cleaner',
    aboutSubtitle: 'Trình trực quan hóa & dọn dẹp ổ đĩa siêu dễ thương',
    authorTitle: 'Tác giả / Người phát triển',
    authorName: 'Sakura Dev',
    amaTitle: 'AMA / Câu hỏi & Góp ý',
    amaText: 'Bạn có câu hỏi, góp ý hay yêu cầu tính năng mới? Đừng ngần ngại liên hệ nhé! (✿◠‿◠)',
    techStackTitle: 'Công nghệ phát triển',
    techStackText: 'Electron 33 • React 18 • Apache ECharts • Tailwind CSS • Node.js',
    licenseTitle: 'Bản quyền',
    licenseText: 'Giấy phép MIT • Mã nguồn mở hoàn toàn miễn phí',
    safeRecycleNote: 'Cam kết an toàn: Tệp xóa được đưa vào Thùng rác Windows, có thể khôi phục bất cứ lúc nào.',
    githubRepoBtn: 'Mã nguồn GitHub 🐙',
    latestReleasesBtn: 'Bản phát hành Exe 🚀'
  },

  ja: {
    appName: 'Sakura Cleaner',
    appSubtitle: 'かわいいPCディスク可視化＆スマートクリーナー (✿◡‿◡)',
    version: 'v1.0 ✨',
    
    // View Modes
    pieChart: '円グラフ 🥧',
    treemap: 'ツリーマップ 🔲',
    list: 'リスト 📋',
    
    // Header actions
    refreshDrives: 'ドライブを再読み込み',
    smartCleanBtn: 'スマートクリーン ✨',
    
    // Mascot
    mascotIdle: 'ドライブを選択するか「フルスキャン」を押してお掃除を始めましょう！',
    mascotSweeping: '{path} をお掃除中... {count} 個のファイル（{size}）を発見！',
    mascotFullScanSweeping: 'PCフルスキャン: ドライブ {index}/{total} ({drive}) をお掃除中... {count} 個のファイル（{size}）を発見！',
    mascotHugeFolder: 'わぁ！「{name}」は {size} も使っています！大きなフォルダですね！',
    mascotScanComplete: 'スキャン完了！{count}個のファイル（計 {size}）を {time} 秒で見つけました！',
    foldersCount: '{count} フォルダ',
    filesCount: '{count} ファイル',
    elapsedTime: '経過時間: {time}秒',
    sakuraChan: 'サクラちゃん',

    // Drive Selector
    storageDrives: 'ストレージドライブ',
    detectedCount: '{count} 台検出',
    usedOfTotal: '• {total} 中 {used} 使用中 ({percent}%)',
    fullScanBtn: '⚡ PCフルスキャン（全ディスク）',
    freeOf: '{free} 空き / 合計 {total}',
    percentUsed: '{percent}% 使用中',
    almostFull: '空き容量わずか！',
    scanSingleDrive: '{name} のみスキャン',

    // Empty state
    noResultsTitle: 'スキャン結果がありません',
    noResultsDesc: '「フルスキャン」または上部のドライブを選択してグラフを表示しましょう！',
    scanDriveOnly: '{name} のみスキャン',

    // Scanning state
    scanningTitle: 'ハードディスクをスキャン中...',
    analyzingFolders: 'フォルダとファイル構造を分析しています',
    filesFoundSoFar: '{count} 個のファイルを発見',

    // Breadcrumbs
    root: 'ルート',
    thisPC: 'このPC (This PC)',

    // Pie Chart
    level: '現在の階層:',
    goUpBtn: '上の階層へ ⬆️',
    clickSliceHint: 'クリックしてフォルダを展開',
    subfolderTitle: 'このフォルダ内の項目（クリックで詳細表示）:',
    noSubfolders: '「{name}」にはこれ以上深いサブフォルダはありません',
    goBackUp: '上の階層に戻る',
    others: 'その他（{count} 項目）',
    clickToDrill: '✨ クリックしてこのフォルダを展開！',
    sizeLabel: 'サイズ:',

    // List View
    nameAndPath: '名前とパス（{count} 項目）',
    proportion: '割合',
    actions: '操作',
    itemsCount: '{count} 項目',

    // Item Details
    nothingSelected: '何も選択されていません',
    nothingSelectedDesc: 'グラフやリストの項目をクリックすると詳細が表示されます。',
    folderType: 'フォルダ',
    occupiedSpace: '占有サイズ',
    topLevelEntries: '{count} 個の項目を含む',
    location: '保存場所',
    copied: 'コピー完了！',
    copy: 'コピー',
    revealExplorer: 'エクスプローラーで開く',
    sendRecycleBin: 'ごみ箱へ移動',
    confirmTrashTitle: 'ごみ箱へ移動しますか？',
    confirmTrashDesc: '選択した項目をWindowsのごみ箱に移動します。',
    yesSendTrash: 'はい、ごみ箱へ 🗑️',
    cancel: 'キャンセル',

    // Smart Clean Modal
    smartCleanTitle: 'スマートクリーナー',
    safePresetsBadge: '安全プリセット',
    smartCleanSubtitle: '一時ファイルやキャッシュを安全に削除して空き容量を取り戻しましょう！',
    detectedJunk: '検出された不要ファイル一覧',
    selectAllSafe: '安全な項目をすべて選択',
    scanningJunk: 'キャッシュをスキャン中...',
    cleanWithLove: '愛をこめてお掃除 💖',
    cleaningProgress: 'お掃除中...',
    close: '閉じる',
    reclaimableSpace: '解放可能な空き容量',
    cleanSuccessTitle: 'やったー！{size} のお掃除に成功しました！',
    cleanSuccessSubtitle: 'PCがすっきり軽くなりました (✿◠‿◠)',
    safeBadge: '安全',
    reviewBadge: '要確認',

    // Toasts
    scanCompletedToast: 'スキャン完了！(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧',
    openedExplorerToast: 'エクスプローラーで表示しました 📂',
    sentToTrashToast: '「{name}」をごみ箱へ移動しました 🗑️',
    cleanSuccessToast: 'スマートクリーン完了！🎉',
    errorToast: 'エラー: {msg}',

    // Info & About Modal
    infoBtn: 'アプリ情報＆作者 (i)',
    aboutTitle: 'Sakura Cleaner について',
    aboutSubtitle: 'かわいいPCディスク可視化＆スマートクリーナー',
    authorTitle: '作者 / 開発者',
    authorName: 'Sakura Dev',
    amaTitle: 'AMA / ご質問・ご意見',
    amaText: 'ご質問、ご意見、機能のリクエストなどがあれば、いつでもお気軽にお尋ねください！(✿◠‿◠)',
    techStackTitle: '使用技術',
    techStackText: 'Electron 33 • React 18 • Apache ECharts • Tailwind CSS • Node.js',
    licenseTitle: 'ライセンス',
    licenseText: 'MIT ライセンス • 完全無料のオープンソース',
    safeRecycleNote: '安全設計: 削除ファイルはWindowsごみ箱へ送られるため、いつでも復元可能です。',
    githubRepoBtn: 'GitHub リポジトリ 🐙',
    latestReleasesBtn: 'リリース ＆ Exe 🚀'
  }
};
