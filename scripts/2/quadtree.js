/*
 * Private class.
 * A container object used to hold user-defined data within a `QuadTreeBin`.
 * Stores it's position within the QuadTree domain.
 */
// QuadTreeBin 내에 사용자 정의 데이터를 저장하는 데 사용되는 컨테이너 객체.
// QuadTree 도메인 내에서 그 위치를 저장합니다.

class QuadTreeItem {

  constructor(x, y, data) {
    this.x = x;
    this.y = y;
    this.data = data;
  }

}



/*
 * Private class.
 * A spatial region of a QuadTree containing 0 or more `QuadTreeItem` instances and 0 or more other `QuadTreeBin` instances.
 */
 //0 개 이상의 QuadTreeItem 인스턴스와 0 개 이상의 다른 QuadTreeBin 인스턴스를 포함하는 QuadTree의 공간 영역.
class QuadTreeBin {

  /*
   * @param maxDepth The maximum number of permitted subdivisions.
   //매개 변수 maxDepth 허용되는 서브 디비전의 최대 수.
   * @param maxItemsPerBin The maximum number of items in a single bin before it is subdivided.
   //매개 변수 maxItemsPerBin 세분화되기 전의 단일 빈에있는 최대 항목 수입니다.
   * @param extent A `Rect` instance specifying the bounds of this `QuadTreeBin` instance within the QuadTree domain.
   //QuadTree 도메인 내에서이 QuadTreeBin 인스턴스의 범위를 지정하는 매개 변수 범위`Rect` 인스턴스.
   * @param depth For internal use only.
   //매개 변수 깊이 내부 용도로만 사용됩니다.
   */
  constructor(maxDepth, maxItemsPerBin, extent, depth = 0) {
    this.rect = extent.copy();
    this.maxDepth = maxDepth;
    this.maxItemsPerBin = maxItemsPerBin;
    this.items = [];
    this.depth = depth;
    this.bins = null;
  }

  /*
   * Check if a point is within the extent of a `QuadTreeBin` instance.
   //포인트가`QuadTreeBin` 인스턴스의 범위 내에 있는지 확인하십시오.
   * Returns true if so, false otherwise.
   //있으면 true를 돌려 주어, 그렇지 않은 경우는 false를 돌려줍니다.
   * @param range Used to check if a point is within a radius of the extent border.
   */
  checkWithinExtent(x, y, range = 0) {
    return x >= this.rect.x - range && x < this.rect.x + this.rect.width + range &&
           y >= this.rect.y - range && y < this.rect.y + this.rect.height + range;
  }

  /*
   * Adds an item to the `QuadTreeBin`.
   * @param item An instance of `QuadTreeItem`.
   //매개 변수 item 은 `QuadTreeItem`의 인스턴스.(포인트 유저데이터)
   */
  addItem(item) {
    if (this.bins === null) {
      this.items.push(item);
      if (this.depth < this.maxDepth && this.items !== null && this.items.length > this.maxItemsPerBin)
        this.subDivide();
    } else {
      const binIndex = this._getBinIndex(item.x, item.y);
      if (binIndex != -1)
        this.bins[binIndex].addItem(item);
    }
  }

  /*
   * Returns a list of items from the bin within the specified radius of the coordinates provided.
   //제공된 좌표의 지정된 반경 내에서 저장소에서 항목 목록을 반환합니다.
   */
  getItemsInRadius(x, y, radius, maxItems) {
    const radiusSqrd = radius ** 2;
    let items = [];

    if (this.bins) {
      for (let b of this.bins)
        if (b.checkWithinExtent(x, y, radius))
          items.push(...b.getItemsInRadius(x, y, radius, maxItems));
    } else {
      for (let item of this.items) {
        const distSqrd = (item.x - x) ** 2 + (item.y - y) ** 2;
        if (distSqrd <= radiusSqrd)
          items.push({ distSqrd: distSqrd, data: item.data });
      }
    }

    return items;
  }

  /*
   * Split a `QuadTreeBin` into 4 smaller `QuadTreeBin`s.
   //`QuadTreeBin`을 네 개의 더 작은`QuadTreeBin`으로 나눕니다.
   * Removes all `QuadTreeItem`s from the bin and adds them to the appropriate child bins.
   //bin에서 모든 QuadTreeItem을 제거하고 적절한 하위 저장소에 추가합니다.
   */
  subDivide() {
    if (this.bins !== null) return;
    this.bins = [];
    let w = this.rect.width * 0.5, h = this.rect.height * 0.5;
    for (let i = 0; i < 4; ++i)
      this.bins.push(new QuadTreeBin(this.maxDepth, this.maxItemsPerBin, new Rect(this.rect.x + i % 2 * w, this.rect.y + Math.floor(i * 0.5) * h, w, h), this.depth + 1));

    for (let item of this.items) {
      const binIndex = this._getBinIndex(item.x, item.y);
      if (binIndex != -1)
        this.bins[binIndex].addItem(item);
    }

    this.items = null;
  }

  /*
   * Renders the borders of the `QuadTreeBin`s within this `QuadTreeBin`.
   * For debugging purposes.
   */
  debugRender(renderingContext) {
    noFill();
    stroke('#aaa');
    strokeWeight(1);
    rect(this.rect.x, this.rect.y, this.rect.width, this.rect.height);
    if (this.bins)
      for (let b of this.bins)
        b.debugRender(renderingContext);
  }

  /*
   * Private.
   */
  _getBinIndex(x, y, range = 0) {
    if (!this.checkWithinExtent(x, y)) return -1;
    let w = this.rect.width * 0.5, h = this.rect.height * 0.5;
    let xx = Math.floor((x - this.rect.x) / w);
    let yy = Math.floor((y - this.rect.y) / h);
    return xx + yy * 2;
  }

}



/*
 * A public class representing a QuadTree structure.
 */
class QuadTree {

  /*
   * @param maxDepth The maximum number of permitted subdivisions.
   * @param maxItemsPerBin The maximum number of items in a single bin before it is subdivided.
   * @param extent A `Rect` instance specifying the bounds of this `QuadTreeBin` instance within the QuadTree domain.
   */
  constructor(maxDepth, maxItemsPerBin, extent) {
    this.extent = extent.copy();
    this.maxDepth = maxDepth;
    this.maxItemsPerBin = maxItemsPerBin;
    this.clear();
  }

  /*
   * Remove all `QuadTreeItem`s and `QuadTreeBin`s from the QuadTree leaving it completely empty.
   */
  clear() {
    this.rootBin = new QuadTreeBin(this.maxDepth, this.maxItemsPerBin, new Rect(0, 0, this.extent.width, this.extent.height));
  }

  /*
   * Add an item at a specified position in the `QuadTree`.
   * @param x The x coordinate of the item.
   * @param y The y coordinate of the item.
   * @param item The user-defined data structure to store in the `QuadTree`.
   */
  addItem(x, y, item) {
    this.rootBin.addItem(new QuadTreeItem(x, y, item));
  }

  /*
   * Returns a list of items within the specified radius of the specified coordinates.
   //지정된 좌표의 지정된 반경 내에있는 항목의 목록을 반환합니다.
   */
  getItemsInRadius(x, y, radius, maxItems) {
    if (maxItems === undefined) {
      return this.rootBin.getItemsInRadius(x, y, radius);
    } else {
      return this.rootBin.getItemsInRadius(x, y, radius)
        .sort((a, b) => a.distSqrd - b.distSqrd)
        .slice(0, maxItems)
        .map(v => v.data);
   }
  }

  /*
   * Renders the borders of the `QuadTreeBin`s within this `QuadTree`.
   * For debugging purposes.
   */
  debugRender(renderingContext) {
    this.rootBin.debugRender(renderingContext);
  }

}
