poetry env use python3.11
poetry install
poetry run nodeenv -n "16.20.1" .nodevenv
npx -y npm@8 install
