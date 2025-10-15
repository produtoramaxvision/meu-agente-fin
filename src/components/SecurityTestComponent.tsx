/**
 * Security Test Component
 * Componente para testar as proteções de segurança implementadas
 * 
 * Testa:
 * - CSRF Protection
 * - Prototype Pollution Protection
 * - XSS Protection (já implementado)
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useCSRFProtection } from '@/lib/csrf';
import { useSafeJSON } from '@/lib/safe-json';
import { sanitizeText } from '@/lib/sanitize';

export function SecurityTestComponent() {
  const { csrfToken, isInitialized } = useCSRFProtection();
  const { parse, parseWithSanitization, isSuspicious } = useSafeJSON();
  const [testResults, setTestResults] = useState<string[]>([]);
  const [testInput, setTestInput] = useState('');

  const addResult = (result: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${result}`]);
  };

  const testCSRFProtection = () => {
    try {
      if (!isInitialized) {
        addResult('❌ CSRF: Token não inicializado');
        return;
      }

      if (!csrfToken) {
        addResult('❌ CSRF: Token não encontrado');
        return;
      }

      addResult(`✅ CSRF: Token gerado - ${csrfToken.substring(0, 8)}...`);
    } catch (error) {
      addResult(`❌ CSRF: Erro - ${error}`);
    }
  };

  const testPrototypePollution = () => {
    try {
      // Teste de prototype pollution
      const maliciousJSON = '{"user": {"__proto__": {"isAdmin": true}}}';
      
      // Parse seguro deve bloquear a poluição
      const safeResult = parseWithSanitization(maliciousJSON);
      
      if (isSuspicious(safeResult)) {
        addResult('❌ Prototype Pollution: Objeto suspeito detectado');
        return;
      }

      // Verificar se Object.prototype foi poluído
      if ((Object.prototype as any).isAdmin) {
        addResult('❌ Prototype Pollution: Object.prototype foi poluído');
        return;
      }

      addResult('✅ Prototype Pollution: Proteção funcionando');
    } catch (error) {
      addResult(`❌ Prototype Pollution: Erro - ${error}`);
    }
  };

  const testXSSProtection = () => {
    try {
      const maliciousInput = '<script>alert("XSS")</script>';
      const sanitized = sanitizeText(maliciousInput);
      
      if (sanitized.includes('<script>')) {
        addResult('❌ XSS: Script não foi sanitizado');
        return;
      }

      addResult('✅ XSS: Script sanitizado com sucesso');
    } catch (error) {
      addResult(`❌ XSS: Erro - ${error}`);
    }
  };

  const testCustomInput = () => {
    try {
      if (!testInput.trim()) {
        addResult('❌ Teste Customizado: Input vazio');
        return;
      }

      // Testar parse seguro
      const parsed = parseWithSanitization(testInput);
      
      if (isSuspicious(parsed)) {
        addResult('⚠️ Teste Customizado: Input suspeito detectado e sanitizado');
        return;
      }

      addResult('✅ Teste Customizado: Input seguro');
    } catch (error) {
      addResult(`❌ Teste Customizado: Erro - ${error}`);
    }
  };

  const runAllTests = () => {
    setTestResults([]);
    addResult('🚀 Iniciando testes de segurança...');
    
    setTimeout(() => testCSRFProtection(), 100);
    setTimeout(() => testPrototypePollution(), 200);
    setTimeout(() => testXSSProtection(), 300);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>🛡️ Testes de Segurança</CardTitle>
          <CardDescription>
            Validação das proteções implementadas na Fase 5.1
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button onClick={runAllTests} variant="default">
              Executar Todos os Testes
            </Button>
            <Button onClick={testCSRFProtection} variant="outline">
              Testar CSRF
            </Button>
            <Button onClick={testPrototypePollution} variant="outline">
              Testar Prototype Pollution
            </Button>
            <Button onClick={testXSSProtection} variant="outline">
              Testar XSS
            </Button>
          </div>

          <div className="space-y-2">
            <Input
              placeholder="Teste customizado (JSON ou texto)"
              value={testInput}
              onChange={(e) => setTestInput(e.target.value)}
            />
            <Button onClick={testCustomInput} variant="secondary" size="sm">
              Testar Input Customizado
            </Button>
          </div>

          {testResults.length > 0 && (
            <Alert>
              <AlertDescription>
                <div className="space-y-1">
                  {testResults.map((result, index) => (
                    <div key={index} className="text-sm font-mono">
                      {result}
                    </div>
                  ))}
                </div>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
