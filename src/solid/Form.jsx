import { splitProps, mergeProps, createMemo } from 'solid-js';
import { createStore, unwrap } from 'solid-js/store';
import { getValueFromEl } from './inputValues';

export const ERROR_CLASS = 'error-input';

const defaultProps = {
  values: {},
  submitHandler: () => {},
  validators: {},
};

export function Form(props) {
  const [local, formAttrs] = splitProps(mergeProps(defaultProps, props), [
    'values',
    'submitHandler',
    'children',
    'validators',
  ]);
  let anyTouched, anyError;
  const [values, setValues] = createStore(local.values);
  const [errors, setErrors] = createStore({
    get $any() {
      return anyError?.();
    },
  });
  const [touched, setTouched] = createStore({
    get $any() {
      return anyTouched?.();
    },
  });

  anyTouched = createMemo(() =>
    Object.values(touched).some((isTouched) => isTouched)
  );
  anyError = createMemo(() =>
    Object.values(errors).some((msg) => msg?.length > 0)
  );
  let formEl;

  const checkValid = async (fieldEl) => {
    if (!fieldEl) return;
    const name = fieldEl.name;
    if (!name) return;
    fieldEl.setCustomValidity('');
    fieldEl.checkValidity();
    let message = fieldEl.validationMessage;
    if (!message && name in local.validators) {
      const validators = local.validators[name];
      for (const validator of Array.isArray(validators)
        ? validators
        : [validators]) {
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
    if (!errored) {
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
