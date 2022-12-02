with import <nixpkgs> { };
mkShell {
  nativeBuildInputs = [
    yarn
    msmtp
  ];
}
