cp package.json package-lock.json .env dist/ && rsync -avz ./ --exclude-from='.rsyncignore' root@46.202.141.240:/projects/rn-gql/be