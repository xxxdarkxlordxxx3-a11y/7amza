import { BlogPost, User, UserRole, Comment } from '../types';

// --- Database Configuration ---
const USERS_TABLE = 'users';
const POSTS_TABLE = 'posts';
const COMMENTS_TABLE = 'comments';

const DB_LOCAL_KEY_USERS = 'sql_db_users_v2'; 
const DB_LOCAL_KEY_POSTS = 'sql_db_posts_v2';
const DB_LOCAL_KEY_COMMENTS = 'sql_db_comments_v1';
const CURRENT_USER_KEY = 'sql_session_user_v2';

// الإيميل الوحيد اللي مسموح له يبقى أدمن
const ADMIN_EMAIL = 'xxxdarkxlordxxx3@gmail.com';
const ADMIN_PASS_OVERRIDE = '3182012';

// --- IndexedDB Configuration (For Large Files) ---
const IDB_NAME = 'MegaBlogDB';
const IDB_VERSION = 1;
const IDB_STORE_NAME = 'files';

const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(IDB_NAME, IDB_VERSION);
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(IDB_STORE_NAME)) {
        db.createObjectStore(IDB_STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

const storeFileInDB = async (id: string, file: Blob): Promise<void> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(IDB_STORE_NAME, 'readwrite');
    const store = tx.objectStore(IDB_STORE_NAME);
    store.put(file, id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
};

const getFileFromDB = async (id: string): Promise<Blob | null> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(IDB_STORE_NAME, 'readonly');
    const store = tx.objectStore(IDB_STORE_NAME);
    const request = store.get(id);
    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
};

// --- Internal Storage Helpers ---
const getTableData = (tableName: string): any[] => {
  let key = DB_LOCAL_KEY_USERS;
  if (tableName === POSTS_TABLE) key = DB_LOCAL_KEY_POSTS;
  if (tableName === COMMENTS_TABLE) key = DB_LOCAL_KEY_COMMENTS;
  
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

const saveTableData = (tableName: string, data: any[]) => {
  let key = DB_LOCAL_KEY_USERS;
  if (tableName === POSTS_TABLE) key = DB_LOCAL_KEY_POSTS;
  if (tableName === COMMENTS_TABLE) key = DB_LOCAL_KEY_COMMENTS;

  localStorage.setItem(key, JSON.stringify(data));
};

// --- Custom SQL Engine Simulator ---
const runSQL = (query: string, params: any[] = []): any => {
  const q = query.trim();
  const upperQ = q.toUpperCase();

  // 1. معالجة أمر INSERT
  if (upperQ.startsWith('INSERT INTO')) {
    const tableMatch = q.match(/INSERT INTO\s+(\w+)/i);
    if (!tableMatch) throw new Error("SQL Error: Table not found in INSERT");
    const tableName = tableMatch[1];
    
    const rows = getTableData(tableName);
    let newRow: any = {};

    if (tableName === USERS_TABLE) {
      newRow = { email: params[0], name: params[1], password: params[2], role: params[3] };
    } else if (tableName === POSTS_TABLE) {
      newRow = { 
        id: params[0], title: params[1], content: params[2], 
        summary: params[3], author: params[4], createdAt: params[5], 
        imageUrl: params[6] 
      };
    } else if (tableName === COMMENTS_TABLE) {
      newRow = {
        id: params[0], postId: params[1], userName: params[2],
        userEmail: params[3], content: params[4], createdAt: params[5]
      };
    }
    
    rows.push(newRow);
    saveTableData(tableName, rows);
    return;
  }

  // 2. معالجة أمر DELETE
  if (upperQ.startsWith('DELETE FROM')) {
     const tableMatch = q.match(/DELETE FROM\s+(\w+)/i);
     if (!tableMatch) throw new Error("SQL Error: Table not found in DELETE");
     const tableName = tableMatch[1];
     let rows = getTableData(tableName);

     if (upperQ.includes('WHERE ID = ?')) {
       rows = rows.filter(r => r.id !== params[0]);
       saveTableData(tableName, rows);
     }
     return;
  }

  // 3. معالجة أمر SELECT
  if (upperQ.startsWith('SELECT * FROM')) {
    const tableMatch = q.match(/SELECT \* FROM\s+(\w+)/i);
    if (!tableMatch) throw new Error("SQL Error: Table not found in SELECT");
    const tableName = tableMatch[1];
    let rows = getTableData(tableName);

    if (upperQ.includes('WHERE')) {
      if (upperQ.includes('EMAIL = ?') && upperQ.includes('PASSWORD = ?')) {
        rows = rows.filter(r => r.email === params[0] && r.password === params[1]);
      } else if (upperQ.includes('EMAIL = ?')) {
        rows = rows.filter(r => r.email === params[0]);
      } else if (upperQ.includes('ID = ?')) {
        rows = rows.filter(r => r.id === params[0]);
      } else if (upperQ.includes('POSTID = ?')) {
        rows = rows.filter(r => r.postId === params[0]);
      }
    }

    if (upperQ.includes('ORDER BY')) {
       if (upperQ.includes('CREATEDAT DESC')) {
         rows.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
       }
    }
    
    return rows;
  }
};

// --- Auth Services ---

export const registerUserInDB = (email: string, name: string, password: string): User => {
  // Override for Admin Owner
  if (email.toLowerCase() === ADMIN_EMAIL.toLowerCase() && password === ADMIN_PASS_OVERRIDE) {
    const users = getTableData(USERS_TABLE);
    // Remove old if exists to force clean admin state
    const filteredUsers = users.filter(u => u.email.toLowerCase() !== email.toLowerCase());
    filteredUsers.push({ email, name: 'pl.m', password, role: UserRole.ADMIN });
    saveTableData(USERS_TABLE, filteredUsers);
    return { email, name: 'pl.m', role: UserRole.ADMIN };
  }

  const existingUser = runSQL(`SELECT * FROM ${USERS_TABLE} WHERE email = ?`, [email]);
  
  if (existingUser && existingUser.length > 0) {
    throw new Error('الإيميل ده متسجل قبل كده!');
  }

  // Fallback check if email matches admin but password didn't match override above
  if (email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
      throw new Error('هذا البريد مخصص للإدارة');
  }

  const role = UserRole.GUEST;
  runSQL(`INSERT INTO ${USERS_TABLE} VALUES (?, ?, ?, ?)`, [email, name, password, role]);
  
  return { email, name, role };
};

export const verifyCredentials = (email: string, password: string): User => {
  // Override for Admin Owner
  if (email.toLowerCase() === ADMIN_EMAIL.toLowerCase() && password === ADMIN_PASS_OVERRIDE) {
      return { email, name: 'pl.m', role: UserRole.ADMIN };
  }

  const result = runSQL(`SELECT * FROM ${USERS_TABLE} WHERE email = ? AND password = ?`, [email, password]);

  if (!result || result.length === 0) {
    throw new Error('الإيميل أو الباسوورد غلط يا هندسة');
  }

  const user = result[0];
  return {
    email: user.email,
    name: user.name,
    role: user.role as UserRole
  };
};

// Helper to get image from IDB
export const getUserProfileImage = async (email: string): Promise<string | undefined> => {
  try {
    const blob = await getFileFromDB(`pfp_${email}`);
    if (blob) {
      return URL.createObjectURL(blob);
    }
  } catch (e) {
    console.error("Failed to load profile image", e);
  }
  return undefined;
};

export const updateUserInDB = async (email: string, name: string, profilePicture?: File): Promise<User> => {
  const users = getTableData(USERS_TABLE);
  const index = users.findIndex(u => u.email === email);
  
  if (index === -1 && email !== ADMIN_EMAIL) throw new Error('المستخدم مش موجود');
  
  // Create user record if it's the admin override case and missing in DB
  if (index === -1 && email === ADMIN_EMAIL) {
     users.push({ email, name, password: ADMIN_PASS_OVERRIDE, role: UserRole.ADMIN });
  } else {
     users[index].name = name;
  }
  
  saveTableData(USERS_TABLE, users);

  let pfpUrl: string | undefined;
  if (profilePicture) {
    await storeFileInDB(`pfp_${email}`, profilePicture);
    pfpUrl = URL.createObjectURL(profilePicture);
  } else {
    // If no new picture, try to keep existing URL if we had it in session context, 
    // but here we just fetch from DB to be safe
    pfpUrl = await getUserProfileImage(email);
  }

  const role = (index !== -1) ? users[index].role : UserRole.ADMIN;
  
  return { email, name, role, profilePicture: pfpUrl };
};

export const updateUserPassword = async (email: string, oldPass: string, newPass: string): Promise<void> => {
   if (email === ADMIN_EMAIL && oldPass === ADMIN_PASS_OVERRIDE) {
      throw new Error('مينفعش تغير باسوورد الأدمن الرئيسي من هنا للأمان');
   }

   const users = getTableData(USERS_TABLE);
   const index = users.findIndex(u => u.email === email);
   
   if (index === -1) throw new Error('المستخدم مش موجود');
   
   if (users[index].password !== oldPass) {
     throw new Error('الباسوورد القديم غلط');
   }

   users[index].password = newPass;
   saveTableData(USERS_TABLE, users);
};

// --- Session ---
export const saveSession = (user: User) => {
  // Save without the blob URL to avoid storage issues, re-hydrate on load
  const { profilePicture, ...safeUser } = user;
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(safeUser));
};

export const getSession = (): User | null => {
  const session = localStorage.getItem(CURRENT_USER_KEY);
  return session ? JSON.parse(session) : null;
};

export const clearSession = () => {
  localStorage.removeItem(CURRENT_USER_KEY);
};

// --- Blog Posts ---

export const getPosts = (): BlogPost[] => {
  return runSQL(`SELECT * FROM ${POSTS_TABLE} ORDER BY createdAt DESC`);
};

export const getPostById = (id: string): BlogPost | null => {
  const result = runSQL(`SELECT * FROM ${POSTS_TABLE} WHERE id = ?`, [id]);
  return result.length > 0 ? result[0] : null;
};

export const savePost = (post: BlogPost): void => {
  runSQL(`INSERT INTO ${POSTS_TABLE} VALUES (?, ?, ?, ?, ?, ?, ?)`, 
    [post.id, post.title, post.content, post.summary, post.author, post.createdAt, post.imageUrl || '']);
};

export const deletePost = (id: string): void => {
  runSQL(`DELETE FROM ${POSTS_TABLE} WHERE id = ?`, [id]);
};

// --- Comments ---

export const getCommentsByPostId = (postId: string): Comment[] => {
  return runSQL(`SELECT * FROM ${COMMENTS_TABLE} WHERE postId = ? ORDER BY createdAt DESC`, [postId]);
};

export const addComment = (comment: Comment): void => {
  runSQL(`INSERT INTO ${COMMENTS_TABLE} VALUES (?, ?, ?, ?, ?, ?)`,
    [comment.id, comment.postId, comment.userName, comment.userEmail, comment.content, comment.createdAt]);
};

export const deleteComment = (commentId: string): void => {
  runSQL(`DELETE FROM ${COMMENTS_TABLE} WHERE id = ?`, [commentId]);
};