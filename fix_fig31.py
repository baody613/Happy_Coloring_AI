import re

with open('Giaithich.md', 'r', encoding='utf-8') as f:
    text = f.read()

pattern = r"## Figure 3\.1\n\*\*Tên hình/mô tả:\*\* System Architecture Diagram \(three\-tier overview\)\n\n\*\*Hướng dẫn chụp/vẽ chi tiết:\*\*\n\*\*Vị trí:\*\* Công cụ vẽ biểu đồ\.\n\*\*Cách chụp/Vẽ:\*\* Sơ đồ khối kiến trúc 3 tầng \(Frontend client, Backend REST API, Database & Services\)\."

mermaid_diagram = """## Figure 3.1
**Tên hình/mô tả:** System Architecture Diagram (three-tier overview)

**Hướng dẫn chụp/vẽ chi tiết:**
💡 *Bạn không cần tự vẽ tay biểu đồ này nữa.* Hãy **Copy đoạn code bên dưới** rồi dán vào trang web **[Mermaid Live](https://mermaid.live/)**. Sau khi trình duyệt vẽ xong, bạn có thể tải bức ảnh (`Actions` > `Download PNG`) để chèn trực tiếp vào báo cáo:

```mermaid
graph TD
    %% Styling
    classDef client fill:#e0f7fa,stroke:#00acc1,stroke-width:2px;
    classDef server fill:#fff3e0,stroke:#00897b,stroke-width:2px;
    classDef data fill:#fce4ec,stroke:#fb8c00,stroke-width:2px;
    classDef highlight fill:#fff9c4,stroke:#e91e63,stroke-width:2px;

    class ClientTier client;
    class ServerTier server;
    class FirebaseTier,AITier data;

    %% Tiers & Nodes
    subgraph ClientTier [1. CLIENT TIER (Vercel)]
        direction TB
        Browser(Web Browser / Mobile)
        NextJS[[Next.js 14 App Router]]
        Zustand([Zustand State])
        
        Browser -->|Interacts| NextJS
        NextJS --- Zustand
    end

    subgraph ServerTier [2. SERVER TIER (Render Cloud)]
        direction TB
        Express((Node.js + Express API))
        AuthMid{{JWT Auth Middleware}}
        
        Express --- AuthMid
    end
    
    subgraph DataServicesTier [3. DATA & SERVICES TIER (Google Cloud)]
        direction LR
        subgraph FirebaseTier [Firebase Platform]
            direction TB
            FBAuth([Firebase Authentication])
            Firestore[(Cloud Firestore NoSQL)]
            Storage[(Firebase Storage)]
        end
        
        subgraph AITier [External AI]
            direction TB
            Gemini[[Google Gemini Flash 2.5 API]]
        end
    end

    %% Connections
    NextJS --> |HTTPS / REST API Requests| AuthMid
    AuthMid -.-> |Verify Token| Express
    
    Express ==> |Firebase Admin SDK| FBAuth
    Express ==> |Firebase Admin SDK| Firestore
    Express ==> |Firebase Admin SDK| Storage
    
    Express ==> |Axios HTTP POST| Gemini
    Gemini -.-> |Return Processed Data| Express
```"""

text = re.sub(pattern, mermaid_diagram, text)

with open('Giaithich.md', 'w', encoding='utf-8') as f:
    f.write(text)

print("Đã cập nhật code Mermaid cho Figure 3.1")
