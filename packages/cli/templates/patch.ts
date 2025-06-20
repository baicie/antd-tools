
import { createRoot } from 'react-dom/client';
import { unstableSetRender } from 'antd';

unstableSetRender(function (node, container) {
  container._reactRoot || (container._reactRoot = createRoot(container));
  var root = container._reactRoot;
  root.render(node);
  return function () {
    return new Promise(function (resolve) {
      setTimeout(function () {
        root.unmount();
        resolve();
      }, 0);
    });
  };
});
