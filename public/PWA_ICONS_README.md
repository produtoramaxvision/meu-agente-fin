# Ícones PWA Necessários

Para completar a configuração PWA, você precisa criar os seguintes ícones na pasta `public/`:

## Ícones Obrigatórios

1. **pwa-192x192.png** (192x192 pixels)
   - Tamanho: 192x192px
   - Formato: PNG
   - Uso: Ícone padrão para dispositivos Android
   - Deve ser quadrado com padding seguro (10% de cada lado)

2. **pwa-512x512.png** (512x512 pixels)
   - Tamanho: 512x512px
   - Formato: PNG
   - Uso: Ícone de alta resolução e maskable para Android
   - Deve ser quadrado com padding seguro (10% de cada lado)
   - Importante: Precisa funcionar como "maskable" (imagem centralizada com padding)

## Como Criar os Ícones

### Opção 1: Usar Ferramentas Online
- https://www.pwabuilder.com/imageGenerator
- https://realfavicongenerator.net/
- https://maskable.app/

### Opção 2: Usar o Logo Existente
Se você tem o logo `meuagente_logo.webp`, você pode:

1. **Converter para PNG** usando um editor de imagens
2. **Redimensionar para 192x192** e **512x512**
3. **Garantir que a imagem seja quadrada** (adicionar padding se necessário)
4. **Salvar como PNG** com fundo transparente ou preto/branco conforme o tema

### Opção 3: Usar Apple Touch Icon como Base
Se você já tem `apple-touch-icon.png`:
1. Copie e renomeie para `pwa-192x192.png` e `pwa-512x512.png`
2. Redimensione se necessário usando um editor de imagens

## Requisitos Técnicos

- **Formato**: PNG
- **Cores**: Suporta transparência (recomendado)
- **Tamanho**: Exatamente 192x192 e 512x512 pixels
- **Padding seguro**: Para ícones maskable, mantenha o conteúdo importante no centro (80% da área)

## Status Atual

⚠️ **Atenção**: A PWA NÃO funcionará completamente até que estes ícones sejam criados.

A aplicação continuará funcionando normalmente, mas:
- O manifest.json será gerado sem os ícones
- A instalação no dispositivo móvel pode falhar
- Os ícones do app instalado não aparecerão corretamente

## Depois de Criar os Ícones

1. Coloque os arquivos na pasta `public/`
2. Execute `npm run build` para gerar o manifest com os ícones
3. Teste a instalação em um dispositivo móvel


