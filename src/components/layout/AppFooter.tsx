import React from 'react';

export function AppFooter() {
  return (
    <footer className="w-full py-3 px-4 border-t border-border bg-bg text-center text-xs text-text" role="contentinfo">
      <div className="container mx-auto">
        <p className="tracking-wide">
          Desenvolvido por ©{' '}
          <a
            href="https://www.produtoramaxvision.com.br/inteligencia-artificial"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-[#8B2424] hover:text-[#6B1B1B] transition-colors underline-offset-2 hover:underline"
            aria-label="Visitar site da Produtora MaxVision"
          >
            Produtora MaxVision
          </a>{' '}
          2025 – Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}