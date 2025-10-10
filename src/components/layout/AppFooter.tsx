import React from 'react';

export function AppFooter() {
  return (
    <footer className="w-full py-3 px-4 border-t border-border bg-bg text-center text-xs text-text-muted">
      <div className="container mx-auto">
        <p className="tracking-wide">
          Desenvolvido por ©{' '}
          <a
            href="https://www.produtoramaxvision.com.br/inteligencia-artificial"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-[#A93838] hover:opacity-80 transition-opacity"
          >
            Produtora MaxVision
          </a>{' '}
          2025 – Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}