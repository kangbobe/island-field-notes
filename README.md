# 富国岛 · 我们的海岛假期

网站：https://kangbobe.github.io/island-field-notes/

2026年11月2日至6日，4位成人。2日15:00抵达，6日10:00起飞。住宿按用户确认的Blue Haven / Regal Villas Tropical Phu Quoc、Tropical Bãi Khem定位。本次首页只展示富国岛。

- 11月3、4、5日三个空白行程栏，电脑拖拽排序、跨日移动，手机选择日期加入、上下移动。
- 21张景点、海滩、餐厅与放松卡片；详细步骤、官方领票/预约、携程/Trip参考及导航。
- 三组可拆开的顺路组合、自定义活动、时间、备注、预约状态。
- 18处公共地点、153组两点组合；区域/类型/日期/距离筛选，直线距离和按需OSRM道路模型时间分开显示。
- 落地当天8个附近候选；航空赠票完整条款；英文询位邮件草稿。
- 当前浏览器保存；分享链接用URL片段携带安排，打开后各自修改，不是实时多人同步。不要填写证件或订单号。

## 开发与验证

index.html内嵌6张CC实景照片与Leaflet，直接静态托管。源码为pq-template.html、pq.css、pq-data.js、pq-core.js和pq-app.js。构建器从现有index.html恢复资源，干净检出也能构建。

构建：python3 build-phuquoc.py；测试：node pq.test.cjs。旧build.py不适用于这次首页。

验证：9组核心与完整页面测试，以及DOM模拟的加入、跨日移动、订位弹窗、英文邮件、备注转义、组合、分享往返与移除。未完成真实浏览器视觉验收。

资料核对2026-11-02；无实时空位、价格或路况，未代发邮件、预订或支付。地图区域代表点清楚标注，按店名核对入口。航空赠票不含Aquatopia，香岛不可驾车直达。

照片作者、原图和CC许可见网页底部，显示时可能裁切；餐厅区域图明确标注。地图©OpenStreetMap（ODbL），Leaflet 1.9.4（BSD-2-Clause，完整许可见ATTRIBUTIONS.md），OSRM无实时路况。
