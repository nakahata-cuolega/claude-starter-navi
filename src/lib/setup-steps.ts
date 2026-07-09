export type OS = "mac" | "windows" | "wsl";

export type Step = {
  title: string;
  description: string;
  command?: string;
  expected?: string;
  note?: string;
};

export const OS_LABELS: Record<OS, string> = {
  mac: "Mac",
  windows: "Windows",
  wsl: "Windows (WSL)",
};

export const OS_HINTS: Record<OS, string> = {
  mac: "macOSでターミナル.appを使ってセットアップします。",
  windows: "Windows標準のPowerShellでセットアップします。いちばん手軽な方法です。",
  wsl: "Windows内にLinux環境(WSL)を作ってセットアップします。本格的に開発したい人向けです。",
};

export const SETUP_STEPS: Record<OS, Step[]> = {
  mac: [
    {
      title: "ターミナルを開く",
      description:
        "「Cmd + Space」でSpotlight検索を開き、「ターミナル」と入力してEnter。黒い(または白い)文字入力の画面が開けばOKです。以降のコマンドはすべてこの画面に貼り付けて実行します。",
    },
    {
      title: "Homebrew(ツール管理アプリ)を入れる",
      description:
        "開発ツールをまとめて管理してくれる定番ツールです。すでに入っている場合はこのステップは飛ばしてOK(「brew --version」で確認できます)。",
      command:
        '/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"',
      note: "途中でMacのパスワードを聞かれます。入力しても画面には何も表示されませんが、正しく入力されているのでそのままEnterを押してください。完了時に「Next steps」として2行のコマンドが表示されたら、それもコピーして実行してください。",
    },
    {
      title: "Node.jsを入れる",
      description: "Claude Codeを動かすのに必要なプログラム実行環境です。",
      command: "brew install node",
      expected: "node --version と入力して「v22.x.x」のようにバージョンが表示されれば成功",
    },
    {
      title: "Claude Codeを入れる",
      description: "本体のインストールです。",
      command: "npm install -g @anthropic-ai/claude-code",
      expected: "claude --version と入力してバージョンが表示されれば成功",
    },
    {
      title: "スキルを入れる",
      description:
        "このサイトで紹介しているスキル一式をダウンロードして、Claude Codeが読み込む場所に配置します。3行まとめてコピーして実行できます。",
      command:
        "git clone https://github.com/nakahata-cuolega/claude-starter.git\nmkdir -p ~/.claude/skills\ncp -r claude-starter/skills/* ~/.claude/skills/",
      note: "初回にgitがXcodeコマンドラインツールのインストールを求めてきたら「インストール」を選び、完了後にもう一度実行してください。",
    },
    {
      title: "Claude Codeを起動してログインする",
      description:
        "「claude」と入力して起動します。初回はブラウザが開いてClaudeアカウントでのログインを求められます。",
      command: "claude",
      note: "利用にはClaudeの有料プラン(Pro / Max)またはAPIキーが必要です。ログイン後、認証がターミナルに戻って完了するまで画面を閉じないでください。",
    },
    {
      title: "動作確認",
      description:
        "Claude Codeの画面で「/new-project」と入力するか、「新しいプロジェクトを作りたい」と話しかけてみてください。プロジェクト作成の案内が始まればセットアップ完了です🎉",
    },
  ],
  windows: [
    {
      title: "PowerShellを開く",
      description:
        "スタートボタンを右クリックして「ターミナル」を選択(または検索で「PowerShell」)。以降のコマンドはこの画面に貼り付けて実行します。",
    },
    {
      title: "GitとNode.jsを入れる",
      description: "Windows標準のアプリ管理コマンド(winget)でまとめて入れます。",
      command: "winget install Git.Git OpenJS.NodeJS.LTS",
      note: "完了したらPowerShellをいったん閉じて開き直してください(新しいコマンドを認識させるため)。",
      expected: "開き直して node --version でバージョンが表示されれば成功",
    },
    {
      title: "Claude Codeを入れる",
      description: "本体のインストールです。",
      command: "npm install -g @anthropic-ai/claude-code",
      expected: "claude --version と入力してバージョンが表示されれば成功",
    },
    {
      title: "スキルを入れる",
      description:
        "このサイトで紹介しているスキル一式をダウンロードして、Claude Codeが読み込む場所に配置します。3行まとめてコピーして実行できます。",
      command:
        'git clone https://github.com/nakahata-cuolega/claude-starter.git\nNew-Item -ItemType Directory -Force "$HOME\\.claude\\skills" | Out-Null\nCopy-Item -Recurse -Force claude-starter\\skills\\* "$HOME\\.claude\\skills\\"',
    },
    {
      title: "Claude Codeを起動してログインする",
      description:
        "「claude」と入力して起動します。初回はブラウザが開いてClaudeアカウントでのログインを求められます。",
      command: "claude",
      note: "利用にはClaudeの有料プラン(Pro / Max)またはAPIキーが必要です。",
    },
    {
      title: "動作確認",
      description:
        "Claude Codeの画面で「/new-project」と入力するか、「新しいプロジェクトを作りたい」と話しかけてみてください。プロジェクト作成の案内が始まればセットアップ完了です🎉",
    },
  ],
  wsl: [
    {
      title: "WSL(Linux環境)を入れる",
      description:
        "スタートボタンを右クリック →「ターミナル(管理者)」を開いて実行します。完了したらPCを再起動してください。",
      command: "wsl --install",
      note: "再起動後にUbuntuの画面が開き、ユーザー名とパスワードの設定を求められます。ここで設定したパスワードは後で使うのでメモしておいてください。",
    },
    {
      title: "Node.jsを入れる",
      description:
        "ここから先はUbuntu(WSL)の画面で実行します。nvmというツール経由で入れるのが定番です。2行を順に実行してください。",
      command:
        'curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash\nsource ~/.bashrc && nvm install --lts',
      expected: "node --version でバージョンが表示されれば成功",
    },
    {
      title: "Claude Codeを入れる",
      description: "本体のインストールです。",
      command: "npm install -g @anthropic-ai/claude-code",
      expected: "claude --version と入力してバージョンが表示されれば成功",
    },
    {
      title: "スキルを入れる",
      description:
        "このサイトで紹介しているスキル一式をダウンロードして、Claude Codeが読み込む場所に配置します。3行まとめてコピーして実行できます。",
      command:
        "git clone https://github.com/nakahata-cuolega/claude-starter.git\nmkdir -p ~/.claude/skills\ncp -r claude-starter/skills/* ~/.claude/skills/",
    },
    {
      title: "Claude Codeを起動してログインする",
      description:
        "「claude」と入力して起動します。初回はブラウザが開いてClaudeアカウントでのログインを求められます。",
      command: "claude",
      note: "利用にはClaudeの有料プラン(Pro / Max)またはAPIキーが必要です。",
    },
    {
      title: "動作確認",
      description:
        "Claude Codeの画面で「/new-project」と入力するか、「新しいプロジェクトを作りたい」と話しかけてみてください。プロジェクト作成の案内が始まればセットアップ完了です🎉",
    },
  ],
};
