import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Hook personalizado para fazer scroll automático para o topo da página
 * sempre que o usuário navegar para uma nova rota.
 * 
 * Funciona detectando mudanças na localização e fazendo scroll suave
 * para o topo do elemento main da aplicação.
 * 
 * Características:
 * - Scroll suave e animado
 * - Funciona com o layout principal da aplicação
 * - Fallback para scroll da janela se necessário
 * - Otimizado para performance
 */
export function useScrollToTop() {
  const location = useLocation();
  const previousPathname = useRef(location.pathname);

  useEffect(() => {
    // Só executa se a rota realmente mudou (não em primeira renderização)
    if (previousPathname.current !== location.pathname) {
      // Pequeno delay para garantir que o DOM foi atualizado
      const timeoutId = setTimeout(() => {
        // Encontrar o elemento main que contém o conteúdo das páginas
        const mainElement = document.querySelector('main');
        
        if (mainElement) {
          // Scroll suave para o topo do elemento main
          mainElement.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
          });
        } else {
          // Fallback: scroll da janela inteira se não encontrar o main
          window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
          });
        }
      }, 50); // Delay mínimo para garantir que o conteúdo foi renderizado

      // Atualizar a referência para a próxima comparação
      previousPathname.current = location.pathname;

      // Cleanup do timeout se o componente for desmontado
      return () => clearTimeout(timeoutId);
    }
  }, [location.pathname]);

  return null;
}
