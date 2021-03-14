import 'regenerator-runtime/runtime';

const pointerEventCtorProps = ['clientX', 'clientY', 'pointerType'];
class PointerEventFake extends Event {
  constructor(type, props) {
    super(type, props);
    pointerEventCtorProps.forEach((prop) => {
      if (props[prop] != null) {
        this[prop] = props[prop];
      }
    });
  }
};
global.PointerEvent = PointerEventFake;
