import { splitProps } from 'solid-js';
import { createStore, unwrap } from 'solid-js/store';
import { getValueFromEl } from './inputValues';

export const ERROR_CLASS = 'error-input';

export function Form(props) {
  const [local, formAttrs] = splitProps(props, [
    'values',
    'submitHandler',
    'children',
    'validators',
  ]);
  const [values, setValues] = createStore(local.values);
  const [errors, setErrors] = createStore({});
  const [touched, setTouched] = createStore({});
  let formEl;

  const checkValid = async (fieldEl) => {
    if (!fieldEl) return;
    fieldEl.setCustomValidity('');
    fieldEl.checkValidity();
    let message = fieldEl.validationMessage;
    if (!message) {
      for (const validator of local.validators?.[fieldEl.name] || []) {
        const text = await validator(fieldEl);
        if (text) {
          fieldEl.setCustomValidity(text);
          break;
        }
      }
      message = fieldEl.validationMessage;
    }
    if (message) {
      fieldEl.classList.toggle(ERROR_CLASS, true);
      setErrors(name, message);
    }
  };

  const submitHandler = async (ev) => {
    ev.preventDefault();
    let errored = false;

    for (const name of Object.keys(values)) {
      const fieldEl = formEl.elements[name];
      if (!fieldEl) break;
      await checkValid(fieldEl);
      if (!errored && fieldEl.validationMessage) {
        fieldEl.focus();
        errored = true;
      }
    }
    if (!errored && local.submitHandler) {
      local.submitHandler(unwrap(values), ev.submitter);
    }
  };

  const inputHandler = (ev) => {
    const fieldEl = ev.target;
    const name = fieldEl.name;
    setErrors(name, undefined);
    setTouched(name, true);
    setValues(name, getValueFromEl(fieldEl));
    fieldEl.classList.toggle(ERROR_CLASS, false);
  };

  const changeHandler = (ev) => {
    checkValid(ev.target);
  };

  return (
    <form
      noValidate
      {...formAttrs}
      onSubmit={submitHandler}
      onInput={inputHandler}
      onChange={changeHandler}
      ref={formEl}
    >
      {typeof local.children == 'function'
        ? local.children({ values, errors, touched })
        : local.children}
    </form>
  );
}

export default Form;