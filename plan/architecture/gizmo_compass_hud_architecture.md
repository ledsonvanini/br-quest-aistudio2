# Planejamento da Feature: Gizmo HUD & Bússola Interativa (Rosa dos Ventos)

## 1. Contexto & Objetivos
- **Rosa dos Ventos Integrada na HUD**: Transformar a Rosa dos Ventos clássica (inspirada no estilo cartográfico vintage) em um Gizmo HUD 3D interativo posicionado no canto inferior (próximo ao rodapé / carrossel de estados).
- **Controle de Rotação e Perspectiva (Estilo Blender/C4D/Three.js)**:
  - Permite orbitar e rotacionar o mapa do Brasil nos eixos Z (Yaw/Orientação Bússola: N, S, L, O) e X (Pitch/Inclinação: 2D Flat 0°, Isométrico Suave 30°, Isométrico Clássico 42°, Perspectiva 60°).
  - Anel interativo e agulha rotativa que reagem ao mouse drag e cliques em pontos cardeais (N, S, L, O).
  - Feedback visual dos eixos XYZ iluminados em tempo real durante a manipulação.
- **Calibração do Centro de Referência do Brasil**:
  - Ajustar o ponto pivô de rotação (`transform-origin`) para coincidir perfeitamente com o baricentro geográfico calibrado do Brasil (-54.39°, -15.18° / X: 1280, Y: 720).
  - Garantir que a rotação e inclinação girem o mapa em torno do centro do território nacional, sem desvios de translação.

## 2. Arquitetura de Componentes
1. **`src/components/map/GizmoCompassHUD.tsx`**:
   - Componente HUD fixo flutuante (`painel-gizmo-bussola`, `container-gizmo-compass-3d`).
   - Rosa dos ventos renderizada com camadas vetoriais em alta fidelidade estética (ouro, bronze e joia central), eixos X/Y/Z reativos e anel de graus (0° a 360°).
   - Suporte a drag direto para girar a bússola (e consequentemente o mapa) com inércia e amortecimento via GSAP / requestAnimationFrame.
   - Menu flutuante com presets de ângulos rápidos:
     - **2D Cartográfico (Flat)**: Pitch 0°, Yaw 0° (Norte para cima).
     - **Isométrico Padrão**: Pitch 42°, Yaw 0°.
     - **Perspectiva Dinâmica**: Pitch 55°, Yaw -15°.
     - **Reset para o Norte (N)**: Alinhamento instantâneo suave com o Norte geográfico.
2. **`src/lib/mapProjections.ts` & `src/components/IsometricMapCanvas.tsx`**:
   - Expandir o estado do palco para suportar `headingAngle` (rotação Z / bússola) e `tiltAngle` (rotação X / perspectiva) controlados sincronizadamente pelo Gizmo HUD.
   - Sincronização bidirecional: quando o usuário arrasta o mapa ou o Gizmo, ambos respondem com suavidade.
3. **Padrão 'classe-para-humanos'**:
   - `painel-gizmo-bussola`, `container-gizmo-compass-3d`, `btn-gizmo-preset-2d`, `btn-gizmo-preset-iso`, `btn-gizmo-preset-perspectiva`, `anel-rotativo-bussola`, `eixo-gizmo-norte`.
