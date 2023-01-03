import React, { useState, useEffect } from "react";
import { nanoid } from 'nanoid';
import { PhonebookList } from "./PhonebookList/PhonebookList";
import { ContactsForm } from "./ContactsForm/ContactsForm";
import { FilterInput } from "./FilterForm/FilterInput";
import style from './app.module.css';

const CONTACTS_KEY = 'CONTACTS_KEY';

export const App = () => {
  const [contacts, setContacts] = useState(JSON.parse(localStorage.getItem(CONTACTS_KEY)) ?? []);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    localStorage.setItem(CONTACTS_KEY, JSON.stringify(contacts));
  }, [contacts])

  const onFormSubmit = (e) => {
    e.preventDefault();
    let alreadyContact = null;
    const form = e.currentTarget;
    const name = form.elements.name.value;
    contacts.forEach(contact => {
      if (contact.name.toLowerCase() === name.toLowerCase()) {
        alreadyContact = true;
      }
    })
    if (alreadyContact) {
      return alert(`${name} is already in contacts`);
    }

    const number = form.elements.number.value;
    const id = nanoid();
    const newContact = {
      id: id,
      name: name,
      number: number,
    }

    setContacts(prevState => {
      return [newContact, ...prevState]
    })
  }

  const onFilterInput = (e) => {
    setFilter(e.currentTarget.value)
  }

  const getSearchContact = () => {
    const normalizedSearchContacts = filter.toLowerCase();
    return contacts.filter(contact => contact.name.toLowerCase().includes(normalizedSearchContacts));
  }

  const onDeleteContact = (id) => {
    setContacts(prevState => prevState.filter(contact => contact.id !== id)
    )
  }

  const actuallyContacts = getSearchContact();
  
  return <div className={style.container}>
    <h1>Phonebook</h1>
    <ContactsForm
      onSubmitFunction={onFormSubmit} />

    <FilterInput
      onFilterInput={onFilterInput} />
    <h2>Contacts</h2>
    {contacts.length > 0 && <PhonebookList
      contact={actuallyContacts}
      onDeleteContact={onDeleteContact} />}
  </div>
};