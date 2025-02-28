---
title: Develop an app
href: /documentation/develop-app
description: How to develop an inlang-based app.
---

# {% $frontmatter.title %}

There are many ways users interact with inlang. This documentation gives you information on how to develop your own inlang-based app.

## Step-by-step

### 1. Open repository

Open a repository locally or with [lix](https://github.com/inlang/monorepo/blob/main/lix/source-code/design-principles.md). Using lix enables you to use git-based features directly in the browser.

### 2. Open project

After opening the repository, you're able to find the files inside. Usually, the `project.inlang.json` file is located in the root of the repository. Reading the file enables you to load the project configuration into your app.

### 3. Use the APIs from the SDK

For working with inlang, you can make use of its
[SDK](/documentation/sdk) which provides you with all the necessary APIs.

### 4. Configure your app

In your app's `marketplace-manifest.json` make sure to define the following information:

| **Parameter**        | **Description**                                               |
|----------------------|---------------------------------------------------------------|
| `id`                 | Unique identifier for your app.                         |
| `icon`        | Link to the icon of your app (optional).              |
| `coverImage`        | Optional cover image acting as preview of your app.              |
| `displayName`        | A user-friendly display name for your app.              |
| `description`        | Briefly describe what your app does.              |
| `readme`             | Link to the README documentation for your app.          |
| `keywords`           | Keywords that describe your app.                        |
| `publisherName`      | Your publisher name.                                          |
| `publisherIcon`      | Link to your publisher's icon or avatar (optional).           |
| `license`            | The license under which your app is distributed.       |
| `website`             | Where your app can be found (optional).               |


### 5. Publish your app

To make your app available in the inlang.com marketplace, see [Publish on marketplace](/documentation/publish-marketplace).

Feel free to [join our Discord](https://discord.gg/gdMPPWy57R) if you have any questions or need assistance developing and publishing your app.
