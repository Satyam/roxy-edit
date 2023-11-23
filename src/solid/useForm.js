import { createStore } from 'solid-js/store';

function checkValid({ element, validators = [] }, setErrors, errorClass) {
  return async () => {
    element.setCustomValidity('');
    element.checkValidity();
    let message = element.validationMessage;
    if (!message) {
      for (const validator of validators) {
        const text = await validator(element);
        if (text) {
          element.setCustomValidity(text);
          break;
        }
      }
      message = element.validationMessage;
    }
    if (message) {
      errorClass && element.classList.toggle(errorClass, true);
      setErrors({ [element.name]: message });
    }
  };
}

export function useForm({ errorClass }) {
  const [errors, setErrors] = createStore({}),
    fields = {};

  const validate = (ref, accessor) => {
    const accessorValue = accessor();
    const validators = Array.isArray(accessorValue) ? accessorValue : [];
    let config;
    fields[ref.name] = config = { element: ref, validators };
    ref.onblur = checkValid(config, setErrors, errorClass);
    ref.oninput = () => {
      if (!errors[ref.name]) return;
      setErrors({ [ref.name]: undefined });
      errorClass && ref.classList.toggle(errorClass, false);
    };
  };

  const formSubmit = (ref, accessor) => {
    const callback = accessor() || (() => {});
    ref.setAttribute('novalidate', '');
    ref.onsubmit = async (e) => {
      e.preventDefault();
      let errored = false;

      for (const k in fields) {
        const field = fields[k];
        await checkValid(field, setErrors, errorClass)();
        if (!errored && field.element.validationMessage) {
          field.element.focus();
          errored = true;
        }
      }
      if (!errored) {
        callback(
          Array.from(form.elements)
            .filter((el) => el.name)
            .reduce((vals, el) => {
              switch (el.nodeName) {
                case 'SELECT':
                  return {
                    ...vals,
                    [el.name]: Array.from(el.selectedOptions).map(
                      (el) => el.value
                    ),
                  };
                case 'BUTTON':
                  return vals;
                default:
                  return { ...vals, [el.name]: el.value };
              }
            }, {}),
          e.submitter,
          ref
        );
      }
    };
  };

  return { validate, formSubmit, errors };
}

export default useForm;
