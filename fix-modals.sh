#!/bin/bash

# Script para substituir automaticamente imports de Modal por SafeModal

echo "Iniciando substituição de Modal por SafeModal..."

# Encontrar todos os arquivos que importam Modal de @lobehub/ui
files=$(find src -name "*.tsx" -exec grep -l "import.*Modal.*from '@lobehub/ui'" {} \;)

for file in $files; do
    echo "Processando: $file"
    
    # Fazer backup do arquivo original
    cp "$file" "$file.backup"
    
    # Substituir import do Modal
    sed -i.tmp 's/import { Modal,/import {/g' "$file"
    sed -i.tmp 's/import { Modal }/import SafeModal from '\''@\/components\/SafeModal'\'';/g' "$file"
    sed -i.tmp 's/Modal, /SafeModal from '\''@\/components\/SafeModal'\''; import { /g' "$file"
    
    # Adicionar import do SafeModal se ainda não existir
    if ! grep -q "SafeModal" "$file"; then
        sed -i.tmp '1i\import SafeModal from '\''@/components/SafeModal'\'';' "$file"
    fi
    
    # Substituir uso do componente Modal por SafeModal
    sed -i.tmp 's/<Modal/<SafeModal/g' "$file"
    sed -i.tmp 's/<\/Modal>/<\/SafeModal>/g' "$file"
    
    # Remover arquivo temporário
    rm "$file.tmp"
    
    echo "Concluído: $file"
done

echo "Substituição concluída!"
echo "Arquivos de backup criados com extensão .backup"