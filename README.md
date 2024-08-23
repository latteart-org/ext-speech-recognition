# ext-speech-recognition

マイクから入力された音声を文字列に変換し、テスト中のコメントとして記録する LatteArt の拡張機能です。

## 事前準備

本拡張機能では音声-文字列の変換を行うため、LatteArt とは別に音声認識サーバを起動する必要があります。

### 音声編集ツール ( SoX ) のインストール

音声認識サーバでマイクからの音声を取得するために、音声編集ツール( `SoX` )をインストールします。

1. `SoX` を「[ダウンロードサイト](https://sourceforge.net/projects/sox/)」からダウンロードし、インストールします。
2. `SoX`のインストールディレクトリにパスを通します。

### 音声認識サーバのビルド

#### ビルド環境のセットアップ

音声認識サーバをビルドするために、`Python`と`Visual Studio Build Tools`をインストールします。

1. `Python3 系`(～ 3.11.x)をインストールします。  
   :warning: バージョン 3.12 だとエラーになるため注意。

1. `Visual Studio Build Tools` をインストールします。
   1. 「[ダウンロードサイト](https://visualstudio.microsoft.com/ja/downloads/)」下部の「すべてのダウンロード」→「Tools for Visual Studio」を開き、「Build Tools for Visual Studio 2022」の右側のボタンからインストーラをダウンロードします。
   1. ダウンロードしたインストールを起動します。
   1. ワークロードから「C++ によるデスクトップ環境」をチェックします。  
      :warning: Windows10 の場合は、右側のインストールの詳細から追加で「Windows 10 SDK」を全てチェックします。(Windows11 の場合は不要)
   1. 右下の「インストール」ボタンを押下します。

#### ビルド手順

1. ext-speech-recognition 拡張の clone
   - 本リポジトリを任意のディレクトリに clone します。
1. 依存パッケージのインストール
   - ext-speech-recognition の`speech-recognition`ディレクトリ配下で以下コマンドを実行し、依存パッケージのインストールを行います。
     ```bash
     $ npm install
     ```
1. サーバのビルド
   - ext-speech-recognition の`speech-recognition`ディレクトリ配下で以下コマンドを実行し、音声認識サーバをビルドします。
     ```bash
     $ npm run build
     ```

### 音声認識ツール(VOSK)のモデルの配置

音声認識サーバでは、OSSの音声認識ツール(`VOSK`)を使用しています。
音声認識を行うために、`VOSK`の言語モデルを音声認識サーバに配置します。

1. ext-speech-recognition の`speech-recognition`ディレクトリ配下に`models`ディレクトリを作成します。
1. `VOSK`の言語モデルを「[ダウンロードサイト](https://alphacephei.com/vosk/models)」からダウンロードし、`models`ディレクトリ配下に配置します。

### 音声認識サーバの設定

`speech-recognition`ディレクトリ配下の設定ファイル(`speech-recognition.config.json`)から各種設定を変更します。

#### `VOSK`の言語モデルのディレクトリパス指定

`modelPath`プロパティで、`VOSK`の言語モデルのディレクトリパスを指定します。

例: `vosk-model-small-ja-0.22`ディレクトリを`models`配下に配置した場合
```jsonc
{
  "modelPath": "./models/vosk-model-small-ja-0.22",
  // ...
}
```

#### その他の設定

必要に応じて音声認識に関する以下の設定も変更可能です。

| プロパティ    |   説明                       |
| ------------ | ---------------------------- |
| sampleRate   | 音声のサンプリングレート。     |
| voskLogLevel | `VOSK` のログレベル。         |

### 音声認識サーバの起動

1. サーバの起動
   - ext-speech-recognition の`speech-recognition`ディレクトリ配下で以下コマンドを実行し、音声認識サーバを起動します。
     ```bash
     $ npm run run
     ```
   
   :bulb: デフォルトの待ち受けポート番号は`3003`です。ポート番号は環境変数`PORT`に設定してサーバを起動することで変更することができます。

## 使用方法

拡張機能 が搭載された LatteArt は以下の画面が拡張されます。

### 設定画面

以下の設定項目が追加されます。

- 音声認識設定
  - テスト中にマイクから入力された音声をコメントとして記録する
    - ON にすると記録中に別途起動した音声認識サーバと通信し、マイクから入力された音声がテスト中のコメントとして自動的に記録されるようになります。
    - :warning: 本設定は保存されません。LatteArt の GUI を再表示した場合は、設定画面から再度設定してください。
  - 音声認識サーバ URL
    - 接続先の音声認識サーバの URL を設定してください。

## ビルド手順 (開発者向け)

以下の手順で LatteArt 本体と組み合わせてビルドします。

### 事前準備

1. LatteArt 本体の clone
   - [LatteArt](https://github.com/latteart-org/latteart) のリポジトリを任意のディレクトリに clone します。
   - :warning: LatteArt 本体のバージョンは **2.15.0** 以上である必要があります。
1. ext-speech-recognition 拡張の clone
   - 本リポジトリを LatteArt 本体とは別のディレクトリに clone します。
1. ext-speech-recognition 拡張の本体側への配置
   - LatteArt 本体側ディレクトリの `latteart/packages/latteart-gui/src/extensions` 配下に `ext-speech-recognition` ディレクトリを作成し、配下に ext-speech-recognition 拡張側ディレクトリの `gui` ディレクトリを**ディレクトリごと**コピーします。
1. 拡張機能を読み込むためのソースコード修正

   - LatteArt 本体側ディレクトリの `latteart/packages/latteart-gui/src/extensions/index.ts`ファイルをエディタで開き、以下のように修正します。

     ```ts
     // ファイル冒頭にimport文を追記
     import { extSpeechRecognition } from "./ext-speech-recognition/gui";

     // ... 省略 ...

     export const extensions: GuiExtension[] = [
       // 配列内に`extSpeechRecognition`を追記
       extSpeechRecognition
     ];
     ```

1. 依存パッケージのインストール

   - LatteArt 本体側ディレクトリのルートディレクトリ(`latteart`) 配下で以下コマンドを実行し、依存パッケージのインストールを行います。
     ```bash
     $ npm install
     ```

### ビルドの実行

事前準備が完了していれば、LatteArt 本体側ディレクトリ配下で各種 npm スクリプトを実行することでビルド可能です。詳細は[LatteArt 本体側のドキュメント](https://github.com/latteart-org/latteart/blob/main/docs/contributing_ja.md#%E9%96%8B%E7%99%BA%E7%94%A8%E3%82%B3%E3%83%9E%E3%83%B3%E3%83%89)をご覧ください。
