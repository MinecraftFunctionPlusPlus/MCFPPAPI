---
lastUpdate: true
---

# Lists

NBT supports the basic data type of lists, which MCFPP abstracts and provides as a separate type.

## Basic Usage

Use the `list<type T>` type identifier to define a list, where the type parameter `T` represents the type of elements stored in the list.

```mcfpp
list<int> l = []; # Create an empty list
l.add(1); # Add an element to the list
l.add(2); 
l.add(3); 
print(l); # Outputs [1,2,3]
print(l[0]);    # Outputs 1

l.removeAt(1); # Remove the element at index 1
```

Passing a list is by value, not by reference. In fact, all NBT-based data types are passed by value.

```mcfpp
list<int> l = [1,2,3];
list<int> l2 = l;
l2.add(4);
print(l); # Outputs [1,2,3]
print(l2); # Outputs [1,2,3,4]
```

## List Operations

The MCFPP standard library provides a series of functions for list operations.

| Function Name | Parameters | Return Value | Description |
| --- | --- | --- | --- |
| `add` | `T element` | `void` | Adds an element to the list |
| `addAll` | `list<T> elements` | `void` | Adds a group of elements to the list |
| `insert` | `int index, T element` | `void` | Inserts an element at a specified position |
| `removeAt` | `int index` | `void` | Removes the element at the specified position |
| `remove` | `T element` | `void` | Removes the specified element |
| `indexOf` | `T element` | `int` | Returns the index of the specified element |
| `lastIndexOf` | `T element` | `int` | Returns the last index of the specified element |
| `contains` | `T element` | `bool` | Checks if the list contains the specified element |
| `clear` | `void` | `void` | Clears the list |

## Iterating Over Lists <Badge type="tip" text="Future Feature" />

Use the `foreach` loop to easily iterate over all elements in a list.

```mcfpp
list<int> l = [1,2,3];
foreach(i in l){
    print(i);
}
```
