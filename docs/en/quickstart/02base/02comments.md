---
lastUpdated: true
---

# Comments

Comment is a kind of text that add in the cod and won’t execute by the compiler. It can use to explain the function, purpose and realization details of the code. In MCFPP, there’re three kinds of comments：single-line comment, block comment and file comment.

## Single-line comment

Single-line comment is a comment that only place in a single line. In MCFPP, single-line comment starts with `#`, until the line ends. Such as:

```mcfpp
#This is a single line 
```

## Block comment

Block comment is a comment that can place in many lines. In MCFPP, block comment starts with `##` and ends with `##`. For example:

```mcfpp
##
This
is
a
block 
comment 
##
```

## Document comment

Document comment is a special comment, It can be extracted by the compiler to generate documents. In MCFPP, document comment starts with `#{`, ends with `}`. For example:

```mcfpp
#{
This is a document comment 
}#
```

Document comment can include some special tags used to tag the content of the comment. Details in the Document chapter (TODO).
