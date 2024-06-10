import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import NestedList from './NestedList';

test('renders NestedList component', () => {
  const { getByText } = render(<NestedList />);
  const addButton = getByText('Add Top-Level Item');
  expect(addButton).toBeInTheDocument();
});

test('adds a top-level item', () => {
  const { getByText } = render(<NestedList />);
  const addButton = getByText('Add Top-Level Item');
  fireEvent.click(addButton);
  const newItem = getByText('New Item');
  expect(newItem).toBeInTheDocument();
});

test('edits an item name', () => {
  const { getByText, getByDisplayValue } = render(<NestedList />);
  const itemToEdit = getByText('Item 1');
  fireEvent.click(itemToEdit);
  const input = getByDisplayValue('Item 1');
  fireEvent.change(input, { target: { value: 'Edited Item' } });
  fireEvent.blur(input);
  const editedItem = getByText('Edited Item');
  expect(editedItem).toBeInTheDocument();
});
