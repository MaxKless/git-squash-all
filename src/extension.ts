import { TextEncoder } from "util";
import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    "git-squash-all.squash-all-commits",
    async () => {
      // generate correct uris
      const rootFolder: vscode.Uri | undefined =
        vscode.workspace.workspaceFolders?.[0].uri;
      if (!rootFolder) {
        vscode.window.showErrorMessage("no open workspace.");
        return;
      }
      const gitRebaseTodoUri = vscode.Uri.joinPath(
        rootFolder,
        ".git/rebase-merge/git-rebase-todo"
      );

      // read git-rebase-todo file
      const gitRebaseTodoDocument = await vscode.workspace.openTextDocument(
        gitRebaseTodoUri
      );
      const gitRebaseTodoContents = gitRebaseTodoDocument.getText();

      // replace all but first pick
      const lines = gitRebaseTodoContents.split("\n");
      const newContents = lines
        .map((value, idx) =>
          idx > 0 ? value.replace("pick", "squash") : value
        )
        .join("\n");

      // write back to file
      await vscode.workspace.fs.writeFile(
        gitRebaseTodoUri,
        new TextEncoder().encode(newContents)
      );
    }
  );

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
