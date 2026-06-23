# Backend Starter Kit - Technical Interview Guide

## Architecture

```text
src/
├── app/
│   └── api/
│       ├── auth/
│       │   ├── login/route.ts
│       │   ├── register/route.ts
│       │   └── me/route.ts
│       └── [resource]/
│           ├── route.ts
│           └── [id]/route.ts
│
├── lib/
│   ├── mongodb.ts
│   ├── auth.ts
│   ├── require-auth.ts
│   └── validations.ts
│
├── models/
│   ├── User.ts
│   └── Resource.ts
│
├── services/
│   ├── user.service.ts
│   └── resource.service.ts
│
├── dto/
│   ├── LoginDto.ts
│   ├── RegisterDto.ts
│   ├── CreateResourceDto.ts
│   └── UpdateResourceDto.ts
│
├── types/
│   └── IUser.ts
│
└── utils/
    └── api-response.ts
```

---

# Standard Development Flow

Every new feature follows this order:

```text
Type
↓
Model
↓
Validation
↓
Service
↓
Route
```

Never start from the route.

---

# Environment Variables

```env
MONGODB_URI=
JWT_SECRET=
EMAIL_USER=
EMAIL_PASS=
```

---

# Dependencies

```bash
bun add mongoose zod bcryptjs jsonwebtoken
bun add -d @types/jsonwebtoken @types/bcryptjs
```

---

# Mongo Connection Pattern

```ts
connectDB();
```

Always call it before:

* find
* create
* update
* delete

---

# Authentication Flow

## Register

```text
validate body
↓
connectDB
↓
check existing user
↓
hash password
↓
create user
↓
generate token
↓
response
```

---

## Login

```text
validate body
↓
connectDB
↓
find user
↓
compare password
↓
generate token
↓
response
```

---

## Protected Route

```text
get token
↓
verify token
↓
get user id
↓
execute logic
```

---

# Service Pattern

Every service should look similar.

```ts
export const ResourceService = {
  create: async () => {},

  findAll: async () => {},

  findById: async () => {},

  update: async () => {},

  delete: async () => {},
};
```

---

# CRUD Pattern

## Create

```ts
const resource =
  await Resource.create(data);
```

---

## Find All

```ts
const resources =
  await Resource.find();
```

---

## Find By Id

```ts
const resource =
  await Resource.findById(id);
```

---

## Update

```ts
const resource =
  await Resource.findByIdAndUpdate(
    id,
    data,
    {
      new: true,
    }
  );
```

---

## Delete

```ts
await Resource.findByIdAndDelete(id);
```

---

# Generic Route Structure

## GET

```ts
connectDB();

const data =
  await ResourceService.findAll();

return NextResponse.json(data);
```

---

## POST

```ts
connectDB();

const body =
  await request.json();

const data =
  await ResourceService.create(body);

return NextResponse.json(data);
```

---

## PATCH

```ts
connectDB();

const body =
  await request.json();

const data =
  await ResourceService.update(
    id,
    body
  );

return NextResponse.json(data);
```

---

## DELETE

```ts
connectDB();

await ResourceService.delete(id);

return NextResponse.json({
  success: true,
});
```

---

# Validation Pattern

```ts
const result =
  Schema.safeParse(body);

if (!result.success) {
  return NextResponse.json(
    {
      message:
        "Validation error",
    },
    {
      status: 400,
    }
  );
}
```

---

# Error Pattern

```ts
try {
  //
} catch (error) {
  return NextResponse.json(
    {
      message:
        error instanceof Error
          ? error.message
          : "Internal Server Error",
    },
    {
      status: 500,
    }
  );
}
```

---

# Relationship Pattern

## One To Many

```ts
userId: {
  type: Schema.Types.ObjectId,
  ref: "User",
  required: true,
}
```

---

## Populate

```ts
await Task.find()
  .populate("userId");
```

---

# Search Pattern

```ts
await Product.find({
  title: {
    $regex: query,
    $options: "i",
  },
});
```

---

# Pagination Pattern

```ts
await Product.find()
  .skip((page - 1) * limit)
  .limit(limit);
```

---

# Sorting Pattern

```ts
await Product.find()
  .sort({
    createdAt: -1,
  });
```

---

# JWT Pattern

```ts
generateToken(userId);
verifyToken(token);
```

---

# Common Interview Models

## Tasks

```ts
title
description
status
userId
```

## Products

```ts
name
description
price
stock
```

## Posts

```ts
title
content
authorId
```

## Reservations

```ts
date
status
userId
```

---

# Response Pattern

```ts
return NextResponse.json({
  success: true,
  data,
});
```

---

# Before Finishing The Test

Checklist:

* [ ] MongoDB connected
* [ ] Environment variables working
* [ ] Validation implemented
* [ ] Error handling implemented
* [ ] Authentication working
* [ ] CRUD working
* [ ] No `any`
* [ ] No lint errors
* [ ] Types everywhere
* [ ] Services separated from routes

---

# Rule For Any Technical Interview

The business changes.

The architecture does not.

Build:

```text
Model
↓
Service
↓
Route
↓
Validation
```

Repeat until the test is finished.
