---
name: territory-precision-cartography
description: Diretrizes e motor de precisão matemática para renderização de formas orgânicas de bacias hidrográficas, biomas e redes de infraestrutura no mapa do Brasil (Canvas 2560x1440 D3 Mercator).
---

# Skill: Território & Precisão Cartográfica Orgânica

## Propósito
Esta skill estabelece os padrões e algoritmos matemáticos para desenhar formas orgânicas de alta fidelidade geográfica no módulo "Território e Redes Vivas". Em vez de bolhas circulares ou elipses sintéticas arbitrárias, todas as áreas de abrangência devem derivar das divisórias orográficas reais, limites de bacias hidrográficas (ANA/HidroWeb) e fronteiras biômicas oficiais (IBGE).

## Princípios de Geometria Orgânica Contínua:
1. **Fidelidade à Hidrologia Real (ANA)**:
   - Os limites de bacias hidrográficas acompanham as serras e divisores de água naturais (ex.: Serra da Canastra para o São Francisco, Serra dos Pireneus para o Tocantins-Araguaia, Chapada dos Parecis para o Amazonas/Paraguai).
   - As fronteiras internacionais do Brasil (norte e oeste) atuam como contorno natural das bacias fronteiriças (Amazônica e Platina).
2. **Topologia Orgânica com Splines Cúbicas (Beziers C/S)**:
   - As curvas de contorno nunca são elipses simples ou polígonos angulares secos; utilizam séries de curvas Bézier cúbicas contínuas que abraçam a linha de costa, o relevo dos planaltos e as calhas fluviais.
3. **Redes Dendríticas e Veios Fluviais**:
   - Os afluentes brotam de nascentes em áreas elevadas e convergem em ângulos hidraulicamente corretos em direção ao tronco principal, sem traços artificiais em "nervuras de folha".
4. **Diagramação e Legibilidade de Balões de Dados**:
   - Os selos e cartões sobrepostos no mapa devem possuir dimensões generosas (mínimo 340px x 60px), tipografia contrastante em camadas, hierarquia clara (Nome da Região em destaque, Vazão em m³/s e % Territorial com cores temáticas), e ancoragem visual límpida sem corte ou sobreposição de texto.
5. **Tratamento Elegante de Estados Muted**:
   - Quando um estado ou região é selecionado, os estados circundantes são suavizados com paleta cartográfica neutra ardósia/índigo (`#0e1726` com bordas sutis `#223249`), mantendo o mapa do Brasil legível e contínuo, sem jamais pintar o mapa de preto puro.
6. **Isolamento de Módulos**:
   - Elementos pertencentes ao módulo dos Guardiões (como avatares, fotos ou standees de NPCs) são estritamente proibidos de aparecer nas visualizações técnicas do módulo de Território.
