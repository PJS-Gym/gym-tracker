{ pkgs, ... }:

{
  languages.python = {
    enable = true;
    package = pkgs.python312;
  };

  packages = with pkgs; [
    bun
    uv
    git
    gh
    gnumake
    postgresql
    terraform
  ];

  enterShell = ''
    echo "Bun: $(bun --version)"
    echo "Python: $(python --version)"
    echo "uv: $(uv --version)"
  '';
}
