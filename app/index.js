// Selectors
const form = document.querySelector('#main-form');
const nameInput = document.querySelector('#name-input');
const phoneInput = document.querySelector('#phone-input');
const formBtn = document.querySelector('#main-form-btn');
const list = document.querySelector('#contacts-list');


// Regex
const NAME_REGEX = /^[A-Z][a-z]*[ ][A-Z][a-z]{2,}$/;
const PHONE_REGEX = /^[0](412|414|424|426|416|212)[0-9]{7}$/;

// Validations
let nameValidation = false;
let phoneValidation = false;

function validateBtn () {
  formBtn.disabled = !(nameValidation && phoneValidation);
}

// Functions
function validateInput (input, validation) {
  const helperText = input.parentElement.children[2];

  if (input.value === '') {
    helperText.classList.remove('show-helper-text');
    input.classList.remove('invalid');
    input.classList.remove('valid');
  } else if (validation) {
    helperText.classList.remove('show-helper-text');
    input.classList.add('valid');
    input.classList.remove('invalid');
  } else {
    helperText.classList.add('show-helper-text');
    input.classList.add('invalid');
    input.classList.remove('valid');
  }
}

const ContactsModuleInit = () => {
  let contacts = [];

  const getContacts = () => {
    return contacts;
  }

  const addContact = (newContact) => {
    contacts.push(newContact);
    console.log('Agregado el contacto al array');
  }

  const saveContactsInBrowser = () => {
    localStorage.setItem('contacts', JSON.stringify(contacts));
  }

  const renderContacts = () => {
    list.innerHTML = '';
    for (const contact of contacts) {
      const li = document.createElement('li');
      li.classList.add('contacts-list-item');
      li.id = contact.id;
      li.innerHTML = `
        <div class="inputs-container">
          <input class="contacts-list-item-name-input" type="text" value="${contact.name}" readonly>
          <input class="contacts-list-item-phone-input" type="text" value="${contact.phone}" readonly>
        </div>
        <div class="btns-container">
          <button class="edit-btn"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
            </svg></button>
          <button class="delete-btn"> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-5">
              <path fill-rule="evenodd" d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.52.149.023a.75.75 0 0 0 .23-1.482A41.03 41.03 0 0 0 14 4.193V3.75A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4ZM8.58 7.72a.75.75 0 0 0-1.5.06l.3 7.5a.75.75 0 1 0 1.5-.06l-.3-7.5Zm4.34.06a.75.75 0 1 0-1.5-.06l-.3 7.5a.75.75 0 1 0 1.5.06l.3-7.5Z" clip-rule="evenodd" />
            </svg></button>
        </div>
      `;
      list.append(li);
    }
  }

  const getContactsFromBrowser = () => {
    const contactsLocalStorage = localStorage.getItem('contacts');
    if (contactsLocalStorage) {
      contacts = JSON.parse(contactsLocalStorage);
    }
  }

  const deleteContact = (id) => {
    contacts = contacts.filter(contact => {
      if (contact.id !== id) {
        return contact
      }
    });
  }
  const editContact = (id, name, phone) => {
    contacts = contacts.map(contact => {
      if (id === contact.id) {
        return { ...contact, name, phone };
      }
      return contact;
    });
  }

  return {
    getContacts,
    addContact,
    saveContactsInBrowser,
    renderContacts,
    getContactsFromBrowser,
    deleteContact,
    editContact
  }
}

const ContactsModule = ContactsModuleInit();

// Events
nameInput.addEventListener('input', e => {
  nameValidation = NAME_REGEX.test(nameInput.value);
  validateInput(nameInput, nameValidation);
  validateBtn();
});

phoneInput.addEventListener('input', e => {
  phoneValidation = PHONE_REGEX.test(phoneInput.value);
  validateInput(phoneInput, phoneValidation);
  validateBtn();
});

form.addEventListener('submit', e => {
  e.preventDefault();

  // Verificar si el número ya existe
  const existingContact = ContactsModule.getContacts().some(contact => contact.phone === phoneInput.value);

  if (existingContact) {
    alert('El número de teléfono ya existe. Por favor, ingresa un número diferente.');
    return;
  }

  // 1. Tomar datos del usuario
  const newContact = {
    id: crypto.randomUUID(),
    name: nameInput.value,
    phone: phoneInput.value,
  };

  // 2. Agregar el contacto al array
  ContactsModule.addContact(newContact);

  // 3. Guardar en el navegador
  ContactsModule.saveContactsInBrowser();

  // 4. Mostrar los contactos en el html
  ContactsModule.renderContacts();

});


list.addEventListener('click', e => {
  const deleteBtn = e.target.closest('.delete-btn');
  const editBtn = e.target.closest('.edit-btn');

  if (deleteBtn) {
    const id = deleteBtn.parentElement.parentElement.id;
    ContactsModule.deleteContact(id);
    ContactsModule.saveContactsInBrowser();
    ContactsModule.renderContacts();
  }

  if (editBtn) {
    const li = editBtn.parentElement.parentElement;
    const nameEditInput = li.children[0].children[0];
    const phoneEditInput = li.children[0].children[1];

    if (li.classList.contains('editando')) {
      
      const nameIsValid = NAME_REGEX.test(nameEditInput.value);
        if (!nameIsValid) {
          alert('La primera letra de cada nombre debe ser en Mayuscula.');
          return;
        }

      const phoneIsValid = PHONE_REGEX.test(phoneEditInput.value);
        if (!phoneIsValid) {
          alert('El número de teléfono debe ser un numero venezolano.');
          return;
        }
      // Logica de negocio
      ContactsModule.editContact(li.id, nameEditInput.value, phoneEditInput.value);
      ContactsModule.saveContactsInBrowser();

      // Logica de renderizado
      editBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
      </svg> 
      `;
      nameEditInput.setAttribute('readonly', true);
      phoneEditInput.setAttribute('readonly', true);
      li.classList.remove('editando');
      ContactsModule.renderContacts();
    } else {
      editBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0  24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
      </svg>`;
      nameEditInput.removeAttribute('readonly');
      phoneEditInput.removeAttribute('readonly');
      li.classList.add('editando');
      console.log('EDITANDO')
    }
  }
  
});

window.onload = () => {
  ContactsModule.getContactsFromBrowser();
  ContactsModule.renderContacts();
}