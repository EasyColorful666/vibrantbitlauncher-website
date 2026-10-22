/* 站点文案与结构化数据（zh 为主，en 为对照） */

export const SITE = {
  brand: 'Vibrantbit',
  brandSuffix: 'Launcher',
  repo: 'https://github.com/EasyColorful666/VibrantbitLauncher.Avalonia',
  releases: 'https://github.com/EasyColorful666/VibrantbitLauncher.Avalonia/releases',
  issues: 'https://github.com/EasyColorful666/VibrantbitLauncher.Avalonia/issues',
  version: '1.0.10.4',
  releasedAt: '2026-10-22',
  accent: '#0078D4'
}

/* 下载清单：与 publish-all.sh 的 ALL_RIDS 一一对应 */
export const PLATFORMS = [
  {
    id: 'windows',
    icon: 'monitor',
    name: { zh: 'Windows', en: 'Windows' },
    arch: { zh: 'Windows 10 / 11，老机器可用兼容模式', en: 'Windows 10 / 11, compatibility mode for older machines' },
    assets: [
      { rid: 'win-x64', arch: 'x64', file: 'VibrantbitLauncher.Avalonia-win-x64.zip', fmt: 'zip', note: { zh: '大多数机器选这个，29 MB', en: 'For most machines, 29 MB' } },
      { rid: 'win-x86', arch: 'x86', file: 'VibrantbitLauncher.Avalonia-win-x86.zip', fmt: 'zip', note: { zh: '32 位系统', en: '32-bit systems' } },
      { rid: 'win-arm64', arch: 'ARM64', file: 'VibrantbitLauncher.Avalonia-win-arm64.zip', fmt: 'zip', note: { zh: 'ARM 笔记本', en: 'ARM laptops' } }
    ]
  },
  {
    id: 'macos',
    icon: 'command',
    name: { zh: 'macOS', en: 'macOS' },
    arch: { zh: 'macOS 11 及以上', en: 'macOS 11 or later' },
    assets: [
      { rid: 'osx-arm64', arch: 'Apple Silicon', file: 'VibrantbitLauncher.Avalonia-osx-arm64.tar.gz', fmt: 'tar.gz / .app', note: { zh: 'M 系列芯片', en: 'M-series chips' } },
      { rid: 'osx-x64', arch: 'Intel', file: 'VibrantbitLauncher.Avalonia-osx-x64.tar.gz', fmt: 'tar.gz / .app', note: { zh: 'Intel 的 Mac', en: 'Intel Macs' } }
    ]
  },
  {
    id: 'linux',
    icon: 'terminal',
    name: { zh: 'Linux', en: 'Linux' },
    arch: { zh: '常见发行版，glibc 2.31 以上', en: 'Common distros, glibc 2.31+' },
    assets: [
      { rid: 'linux-x64', arch: 'x64', file: 'VibrantbitLauncher.Avalonia-linux-x64.tar.gz', fmt: 'tar.gz', note: { zh: 'x86_64', en: 'x86_64' } },
      { rid: 'linux-arm64', arch: 'ARM64', file: 'VibrantbitLauncher.Avalonia-linux-arm64.tar.gz', fmt: 'tar.gz', note: { zh: 'ARM 设备', en: 'ARM devices' } }
    ]
  }
]

export const SECTION_KIND = {
  新增: { key: 'new', zh: '新增', en: 'New' },
  新增功能: { key: 'new', zh: '新增', en: 'New' },
  修复: { key: 'fix', zh: '修复', en: 'Fix' },
  修正: { key: 'fix', zh: '修正', en: 'Fix' },
  变更: { key: 'change', zh: '变更', en: 'Change' },
  调整: { key: 'change', zh: '调整', en: 'Change' },
  改进: { key: 'improve', zh: '改进', en: 'Improve' },
  界面: { key: 'ui', zh: '界面', en: 'UI' },
  界面设计: { key: 'ui', zh: '界面', en: 'UI' },
  说明: { key: 'note', zh: '说明', en: 'Note' },
  已知: { key: 'note', zh: '已知', en: 'Known' }
}

export const CONTENT = {
  zh: {
    langLabel: 'EN',
    nav: {
      features: '功能',
      why: '参数',
      download: '下载',
      changelog: '更新日志',
      faq: '常见问题'
    },
    actions: {
      download: '下载',
      releases: 'GitHub Releases',
      source: '源码',
      readChangelog: '全部更新日志',
      more: '看更早的版本',
      collapse: '收起',
      expand: '展开',
      allVersions: '在 GitHub 上看全部版本'
    },
    hero: {
      eyebrow: 'Avalonia · .NET 10 · AGPL-3.0',
      title: 'Minecraft',
      titleAccent: '启动器。',
      desc: '装版本、装模组、管账号、开联机，一个窗口里做完。Windows、Linux、macOS 都有对应的包。',
      primary: '下载',
      secondary: '去 GitHub 看看',
      tabs: [
        { id: 'home', label: '启动页' },
        { id: 'account', label: '账户' },
        { id: 'download', label: '下载中心' }
      ],
      caption: '截图来自启动器实际界面。',
      facts: ['自带 .NET 10 运行时', '7 个平台架构', 'AGPL-3.0 开源']
    },
    features: {
      kicker: '功能',
      title: '主要功能',
      sub: '装游戏、装模组、进服务器，用到的都在这。',
      items: [
        { icon: 'layers', title: '启动页就是主页', desc: '打开就是版本列表，选一个，点下面的「启动游戏」。右边常驻快捷设置：Minecraft 文件夹、Java 路径、外观亮色或深蓝，不用翻设置页。' },
        { icon: 'boxes', title: '下载中心', desc: '左栏分游戏版本、社区资源、Java 三块，社区资源下面还有模组、整合包、数据包、资源包、光影。搜版本时会显示「显示 103 / 共 920 个版本」。' },
        { icon: 'download', title: '安装版本', desc: '原版和 Forge、NeoForge、Fabric、Quilt 共用一套安装流程，需要的库和资源会自己下完；连不上官方源时走 BMCLAPI。' },
        { icon: 'package', title: '模组', desc: '在 Modrinth 里搜，选中就装进指定的版本；缺的前置模组会一起列出来。' },
        { icon: 'userRound', title: '账户', desc: '微软正版、外置验证服务器、离线名字三种都能加。启动时用哪个账户，在这一页选。' },
        { icon: 'coffee', title: '版本设置与工具箱', desc: '版本列表每行都有工具箱和设置：开模组目录、存档目录、导入模组和压缩包，改内存、JVM 参数、窗口大小。配装码能把版本、加载器、模组清单和参数压成一段码，别人拿码就能照着重装一套。' },
        { icon: 'network', title: '联机', desc: '内置 EasyTier 虚拟局域网。建房的人填一个密钥，别人填同一个就能连进来，不用公网 IP。' },
        { icon: 'shield', title: '出问题能查', desc: '崩溃后能读报告、指出是哪个模组；资源缺失可以补全，版本文件也能查完整性，不用整个重装。' }
      ]
    },
    why: {
      kicker: '参数',
      title: '技术参数',
      sub: '运行环境、支持范围、许可，都在这一页说清楚。',
      cols: ['项目', '说明'],
      rows: [
        { label: '运行环境', ours: '自包含发布，目标机器不用装 .NET（win-x64 剪裁后 29 MB）' },
        { label: '平台', ours: 'Windows x64 / x86 / ARM64，Linux x64 / ARM64，macOS Intel / Apple Silicon' },
        { label: '模组来源', ours: 'Modrinth' },
        { label: '账号', ours: '微软、离线、Yggdrasil 外置登录' },
        { label: '界面', ours: 'Avalonia + Fluent，亮暗主题、主题色可改' },
        { label: '许可', ours: 'AGPL-3.0' }
      ],
      stats: [
        { value: '7', label: '个平台架构' },
        { value: '3', label: '种登录方式' },
        { value: '2', label: '套界面主题' },
        { value: 'AGPL', label: '开源许可' }
      ]
    },
    download: {
      kicker: '下载',
      title: '下载',
      sub: 'Windows 用 zip，macOS 和 Linux 用 tar.gz。运行时打在包里，机器上不用另装东西。',
      latest: '最新版',
      published: '发布于',
      form: '自带运行时',
      note: '解压就能开。也支持 --framework-dependent 打成 15 MB 左右的小包，那种才需要自己装 .NET 10。',
      rid: '架构',
      file: '文件',
      format: '格式',
      action: '下载',
      all: '去 GitHub 看全部版本和校验值'
    },
    changelog: {
      kicker: '更新日志',
      title: '最近改了什么',
      sub: '版本号、日期、这次动了哪些地方。',
      latest: '最新',
      count: '项改动',
      total: '共 {n} 个版本',
      more: '看更早的版本',
      source: '数据来自仓库里的 CHANGELOG.md',
      empty: '还没记'
    },
    faq: {
      kicker: '答疑',
      title: '常见问题',
      sub: '没写到的，去 Issues 问。',
      items: [
        { q: '要自己装 Java 或 .NET 吗？', a: '都不用。发布包自带 .NET 10 运行时，Java 会按游戏版本自动下载；不想用自动下的，可以在设置里指到本地 JDK。' },
        { q: '支持哪些加载器？', a: 'Forge、NeoForge、Fabric、Quilt 和原版。Forge 和 NeoForge 的 maven 在国内经常连不上，会自己换 BMCLAPI 镜像。' },
        { q: '愚人节版本怎么回事？', a: 'Mojang 清单里没这个分类，15w14a、24w14potato 这些都写成 snapshot。启动器按 id 单独认了 8 个，不然它们会混在测试版里。' },
        { q: '能导入别的启动器的实例吗？', a: '标准 .minecraft 的版本目录放进 versions 就行；版本页也能导入模组和 zip。整合包支持 mrpack 和 zip，装的时候会把缺的资源补上。' },
        { q: '联机要公网 IP 吗？', a: '不要。EasyTier 走 P2P，建房的人定一个密钥，其他人填同一个就进同一个房间。' },
        { q: '下载太慢怎么办？', a: '设置里把 BMCLAPI 镜像打开，下载并发、分块数、重试次数也能调。' },
        { q: '有问题去哪说？', a: 'GitHub Issues。把设置页里「打开日志目录」的日志和崩溃报告带上，查起来快很多。' }
      ]
    },
    footer: {
      mark: 'Vibrantbit',
      tagline: '跨平台 Minecraft 启动器，AGPL-3.0 开源。',
      cols: [
        {
          title: '产品',
          links: [
            { label: '功能', href: '#features' },
            { label: '下载', href: '#download' },
            { label: '更新日志', href: '#changelog' },
            { label: '常见问题', href: '#faq' }
          ]
        },
        {
          title: '资源',
          links: [
            { label: 'GitHub Releases', href: 'https://github.com/EasyColorful666/VibrantbitLauncher.Avalonia/releases', external: true },
            { label: 'CHANGELOG.md', href: 'https://github.com/EasyColorful666/VibrantbitLauncher.Avalonia/blob/main/CHANGELOG.md', external: true },
            { label: 'Modrinth', href: 'https://modrinth.com', external: true },
            { label: 'BMCLAPI', href: 'https://bmclapidoc.bangbang93.com/', external: true }
          ]
        },
        {
          title: '项目',
          links: [
            { label: 'GitHub', href: 'https://github.com/EasyColorful666/VibrantbitLauncher.Avalonia', external: true },
            { label: '问题反馈', href: 'https://github.com/EasyColorful666/VibrantbitLauncher.Avalonia/issues', external: true },
            { label: 'Avalonia', href: 'https://avaloniaui.net', external: true },
            { label: '.NET 10', href: 'https://dotnet.microsoft.com', external: true }
          ]
        }
      ],
      meta: '© 2026 Vibrantbit Launcher',
      built: 'Avalonia · .NET 10 · AGPL-3.0',
      disclaimer: '这不是 Minecraft 官方服务，也没经过 Mojang 或 Microsoft 批准。Minecraft 是 Mojang Synergies AB 的商标。'
    }
  },

  en: {
    langLabel: '中文',
    nav: {
      features: 'Features',
      why: 'Specs',
      download: 'Download',
      changelog: 'Changelog',
      faq: 'FAQ'
    },
    actions: {
      download: 'Download',
      releases: 'GitHub Releases',
      source: 'Source',
      readChangelog: 'Full changelog',
      more: 'Older releases',
      collapse: 'Collapse',
      expand: 'Show',
      allVersions: 'All releases on GitHub'
    },
    hero: {
      eyebrow: 'Avalonia · .NET 10 · AGPL-3.0',
      title: 'Minecraft',
      titleAccent: 'launcher.',
      desc: 'Install versions, add mods, manage accounts, start a LAN session — one window. Builds for Windows, Linux and macOS.',
      primary: 'Download',
      secondary: 'See it on GitHub',
      tabs: [
        { id: 'home', label: 'Home' },
        { id: 'account', label: 'Accounts' },
        { id: 'download', label: 'Downloads' }
      ],
      caption: 'Screenshots taken from the actual launcher.',
      facts: ['Runtime bundled', '7 build targets', 'AGPL-3.0']
    },
    features: {
      kicker: 'Features',
      title: 'What it does',
      sub: 'Installing the game, adding mods, joining a server — all in one window.',
      items: [
        { icon: 'layers', title: 'The home page is a launch page', desc: 'It opens on your version list: pick one, press Play. Quick settings stay on the right — Minecraft folder, Java path, light or dark-blue appearance — so you do not have to dig through Settings.' },
        { icon: 'boxes', title: 'Downloads hub', desc: 'The left rail splits into game versions, community content (mods, modpacks, data packs, resource packs, shaders) and Java. Searching shows "showing 103 of 920 versions".' },
        { icon: 'download', title: 'Install versions', desc: 'Vanilla and Forge, NeoForge, Fabric, Quilt share one install flow. Libraries and assets are fetched automatically, with a BMCLAPI fallback when official hosts are unreachable.' },
        { icon: 'package', title: 'Mods', desc: 'Search Modrinth and install into a chosen version; missing dependencies are listed along with it.' },
        { icon: 'userRound', title: 'Accounts', desc: 'Microsoft, an external auth server, or a plain offline name. Pick which one to launch with on this page.' },
        { icon: 'coffee', title: 'Instance tools and settings', desc: 'Each row has a toolbox and a settings button: open the mod or save folder, import mods and archives, change memory, JVM arguments and window size. A loadout code packs the version, loader, mod list and JVM arguments into one string that someone else can paste to rebuild the same setup.' },
        { icon: 'network', title: 'Multiplayer', desc: 'EasyTier is built in. The host sets a key and anyone entering the same key joins the same virtual LAN — no public IP needed.' },
        { icon: 'shield', title: 'When it breaks', desc: 'Crash reports are read down to the mod at fault, missing assets can be restored and version files verified, without reinstalling everything.' }
      ]
    },
    why: {
      kicker: 'Specs',
      title: 'Technical details',
      sub: 'Runtime, supported range and licence, all in one place.',
      cols: ['Item', 'Detail'],
      rows: [
        { label: 'Runtime', ours: 'Self-contained; nothing to install (win-x64 is 29 MB after trimming)' },
        { label: 'Platforms', ours: 'Windows x64 / x86 / ARM64, Linux x64 / ARM64, macOS Intel / Apple Silicon' },
        { label: 'Mod source', ours: 'Modrinth' },
        { label: 'Accounts', ours: 'Microsoft, offline, Yggdrasil' },
        { label: 'Interface', ours: 'Avalonia + Fluent, light and dark themes, editable accent colour' },
        { label: 'Licence', ours: 'AGPL-3.0' }
      ],
      stats: [
        { value: '7', label: 'build targets' },
        { value: '3', label: 'sign-in methods' },
        { value: '2', label: 'interface themes' },
        { value: 'AGPL', label: 'licence' }
      ]
    },
    download: {
      kicker: 'Download',
      title: 'Download',
      sub: 'Windows ships as zip, macOS and Linux as tar.gz. The runtime is bundled, so there is nothing else to install.',
      latest: 'Latest',
      published: 'Released',
      form: 'Runtime bundled',
      note: 'Unzip and run. A framework-dependent build (~15 MB) is also available if you already have .NET 10.',
      rid: 'Target',
      file: 'File',
      format: 'Format',
      action: 'Get',
      all: 'All releases and checksums on GitHub'
    },
    changelog: {
      kicker: 'Changelog',
      title: 'What changed',
      sub: 'Version, date, and what actually moved this time.',
      latest: 'Latest',
      count: 'changes',
      total: '{n} releases',
      more: 'Older releases',
      source: 'Generated from CHANGELOG.md in the repository',
      empty: 'Nothing yet'
    },
    faq: {
      kicker: 'FAQ',
      title: 'Questions',
      sub: 'Anything missing? Ask in Issues.',
      items: [
        { q: 'Do I need to install Java or .NET?', a: 'Neither. The .NET 10 runtime is bundled in the package, and Java is downloaded to match the game version; if you would rather use your own, point Settings at a local JDK.' },
        { q: 'Which loaders work?', a: 'Forge, NeoForge, Fabric, Quilt and vanilla. Forge and NeoForge maven hosts are often unreachable in mainland China, so it switches to the BMCLAPI mirror.' },
        { q: 'What are the April Fools versions?', a: 'Mojang\'s manifest has no such category — 15w14a, 24w14potato and friends are tagged as snapshots. The launcher recognises the eight by id so they do not clutter the snapshot list.' },
        { q: 'Can it import instances from another launcher?', a: 'A standard .minecraft version folder can go into versions, and the version page imports mods and zip archives. Modpacks work as mrpack or zip, with missing assets restored during install.' },
        { q: 'Does multiplayer need a public IP?', a: 'No. EasyTier runs peer to peer: the host picks a key, and anyone entering the same key joins the same room.' },
        { q: 'Downloads are slow, what can I do?', a: 'Turn on the BMCLAPI mirror in Settings; download concurrency, chunk count and retry count are adjustable there too.' },
        { q: 'Where do I report problems?', a: 'GitHub Issues. Attach the logs and crash report from "Open log folder" in Settings and it is much quicker to trace.' }
      ]
    },
    footer: {
      mark: 'Vibrantbit',
      tagline: 'A cross-platform Minecraft launcher, AGPL-3.0.',
      cols: [
        {
          title: 'Product',
          links: [
            { label: 'Features', href: '#features' },
            { label: 'Download', href: '#download' },
            { label: 'Changelog', href: '#changelog' },
            { label: 'FAQ', href: '#faq' }
          ]
        },
        {
          title: 'Resources',
          links: [
            { label: 'GitHub Releases', href: 'https://github.com/EasyColorful666/VibrantbitLauncher.Avalonia/releases', external: true },
            { label: 'CHANGELOG.md', href: 'https://github.com/EasyColorful666/VibrantbitLauncher.Avalonia/blob/main/CHANGELOG.md', external: true },
            { label: 'Modrinth', href: 'https://modrinth.com', external: true },
            { label: 'BMCLAPI', href: 'https://bmclapidoc.bangbang93.com/', external: true }
          ]
        },
        {
          title: 'Project',
          links: [
            { label: 'GitHub', href: 'https://github.com/EasyColorful666/VibrantbitLauncher.Avalonia', external: true },
            { label: 'Issues', href: 'https://github.com/EasyColorful666/VibrantbitLauncher.Avalonia/issues', external: true },
            { label: 'Avalonia', href: 'https://avaloniaui.net', external: true },
            { label: '.NET 10', href: 'https://dotnet.microsoft.com', external: true }
          ]
        }
      ],
      meta: '© 2026 Vibrantbit Launcher',
      built: 'Avalonia · .NET 10 · AGPL-3.0',
      disclaimer: 'This is not an official Minecraft service and is not approved by or associated with Mojang or Microsoft. Minecraft is a trademark of Mojang Synergies AB.'
    }
  }
}
