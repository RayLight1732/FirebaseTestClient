import { db, auth, storage } from "./initialize.mjs";
import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  where,
  limit as funcLimit,
  startAfter as funcStartAfter,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

function getMusicRef() {
  return collection(db, "music");
}

/**
 * この関数が呼ばれた直後と、楽曲割り当て状態の更新が行われた際に、コールバックを呼び出す
 * @see {@link https://firebase.google.com/docs/firestore/query-data/listen?hl=ja}
 * @param {*} onSnapshotCallback
 * @returns
 */
export function updateDispatchUI(onSnapshotCallback) {
  return onSnapshot(
    doc(db, "dispatch", auth.currentUser.uid),
    onSnapshotCallback
  );
}

/**
 * 楽曲をアップロードする
 * @param {File} musicFile 担当パートの音楽
 * @returns 成功した場合true
 * @throws アップロードが失敗した場合エラー
 */
export async function uploadMusic(musicFile) {
  try {
    const result = await auth.currentUser.getIdTokenResult(true);
    console.log(JSON.stringify(result.claims));
    const storageRef = ref(
      storage,
      `users/${auth.currentUser.uid}/music/${result.claims.ref}`
    );
    await uploadBytes(storageRef, musicFile);
    console.log("upload success");
    return true;
  } catch (error) {
    throw error;
  }
}

/**
 * 楽曲のダウンロード用URLを取得する
 * @param {Array<string>} authorIds 作成者の配列 インデックス0:ドラム,1:ベース,2:ギター,3:ボーカル
 * @param {Array<string>} refs 楽曲の参照の配列 インデックス0:ドラム,1:ベース,2:ギター,3:ボーカル
 * @returns {Array<URL>} ダウンロード用URLの配列
 */
export async function getMusicURLs(authorIds, refs) {
  try {
    console.log(authorIds);
    const promises = authorIds.map((authorID, index) =>
      getDownloadURL(ref(storage, `users/${authorID}/music/${refs[index]}`))
    );
    const result = await Promise.all(promises);
    return result;
  } catch (error) {
    throw error;
  }
}

/**
 * 関与した楽曲を取得する
 * @param {string} [uid=uid=ログインしているユーザーのuid] uid
 * @returns ドキュメントの配列 @see {@link https://firebase.google.com/docs/firestore/query-data/get-data?hl=ja}
 */
export async function getInvolvedMusic(uid = auth.currentUser.uid) {
  const q = query(
    getMusicRef(),
    where("authorIDs", "array-contains", uid),
    orderBy("date", "desc")
  );
  return await getDocs(q);
}

/**
 * 全ての楽曲の中からいくつかを取得する
 * @param {number} [limit=10] 取得する数
 * @param {} [startAfter] 指定したドキュメントの後から取得を開始する
 * @returns ドキュメントの配列 @see {@link https://firebase.google.com/docs/firestore/query-data/get-data?hl=ja}
 */
export async function getMusic(limit = 10, startAfter) {
  //即時関数
  const q = (() => {
    if (startAfter) {
      return query(
        getMusicRef(),
        orderBy("date", "desc"),
        funcLimit(limit),
        funcStartAfter(startAfter)
      );
    } else {
      return query(getMusicRef(), orderBy("date", "desc"), funcLimit(limit));
    }
  })();
  return await getDocs(q);
}
