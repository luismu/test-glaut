import React, { useState } from 'react';
import './index.css';

const json =[
  {
      "name": "Item 1",
      "children": [
          {
              "name": "Item 1.1",
              "children": []
          }
      ]
  },
  {
      "name": "Item 2",
      "children": []
  }
]

/**
 * Component for rendering a list item with nested items.
 *
 * @param {Object} props - The component props.
 * @param {Object} props.item - The list item object.
 * @param {Function} props.addItem - The function to add a new item.
 * @param {Function} props.editItem - The function to edit an item.
 * @param {number} props.level - The level of the item in the list.
 * @param {number} props.maxLevel - The maximum level of nesting.
 * @returns {JSX.Element} - The rendered list item component.
 */
const ListItem = ({ item, addItem, editItem, level, maxLevel }) => {
  // State for editing the item name
  const [isEditing, setIsEditing] = useState(false);
  const [itemName, setItemName] = useState(item.name);

  /**
   * Handles the edit action and updates the item name.
   */
  const handleEdit = () => {
    editItem(item, itemName);
    setIsEditing(false);
  };

  return (
    <li>
      {/* Render editable input when editing, otherwise render the item name */}
      {isEditing ? (
        <input
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          onBlur={handleEdit}
          onKeyPress={(e) => e.key === 'Enter' && handleEdit()}
          autoFocus
        />
      ) : (
        <span onClick={() => setIsEditing(true)}>{item.name}</span>
      )}

      {/* Render button to add a new item if not at the maximum level */}
      {level < maxLevel && (
        <button className='btn-plus' onClick={() => addItem(item)}>+</button>
      )}

      {/* Render nested items if the item has children */}
      {item.children.length > 0 && (
        <ul>
          {item.children.map((child, index) => (
            <ListItem
              key={index}
              item={child}
              addItem={addItem}
              editItem={editItem}
              level={level + 1}
              maxLevel={maxLevel}
            />
          ))}
        </ul>
      )}
    </li>
  );
};

/**
 * Component for rendering a nested list with items that can be added, edited, and expanded.
 *
 * @returns {JSX.Element} - The rendered nested list component.
 */
const NestedList = () => {
  // State for storing the list items
  const [items, setItems] = useState(json);

  /**
   * Adds a new item to the list.
   *
   * @param {Object} parent - The parent item to add the new item to. If null, adds to the top level.
   */
  const addItem = (parent = null) => {
    const newItem = { name: 'New Item', children: [] };

    if (!parent) {
      // If no parent, add to the top level
      setItems([...items, newItem]);
    } else {
      // If parent, add to the parent's children
      const addNestedItem = (items) =>
        items.map((item) =>
          item === parent
            ? { ...item, children: [...item.children, newItem] }
            : { ...item, children: addNestedItem(item.children) }
        );
      setItems(addNestedItem(items));
    }
  };

  /**
   * Edits an item's name.
   *
   * @param {Object} itemToEdit - The item to edit.
   * @param {string} newName - The new name for the item.
   */
  const editItem = (itemToEdit, newName) => {
    const updateItemName = (items) =>
      items.map((item) =>
        item === itemToEdit
          ? { ...item, name: newName }
          : { ...item, children: updateItemName(item.children) }
      );
    setItems(updateItemName(items));
  };

  return (
    <div className="App">
      <div className="App-header tree">
        <button className='btn-add-item-top' onClick={() => addItem()}>Add Top-Level Item</button>
        {/* Render each item in the list */}
        <ul>
          {items.map((item, index) => (
            <ListItem
              key={index}
              item={item}
              addItem={addItem}
              editItem={editItem}
              level={0}
              maxLevel={3}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};


export default NestedList;
