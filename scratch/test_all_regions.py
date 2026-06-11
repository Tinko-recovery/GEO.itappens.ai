import socket

regions = [
    "us-east-1", "us-east-2", "us-west-1", "us-west-2",
    "ap-south-1", "ap-southeast-1", "ap-southeast-2",
    "ap-northeast-1", "ap-northeast-2", "ap-northeast-3",
    "eu-west-1", "eu-west-2", "eu-west-3", "eu-central-1", "eu-central-2",
    "ca-central-1", "sa-east-1"
]

clusters = ["aws-0", "aws-1", "aws-2"]
project_id = "ruuabsvxzcerjrvgthid"

print(f"Scanning clusters for project: {project_id}...")

for cluster in clusters:
    for region in regions:
        host = f"{cluster}-{region}.pooler.supabase.com"
        port = 6543
        try:
            # First resolve the host
            ip = socket.gethostbyname(host)
            
            # Try a connection
            s = socket.create_connection((host, port), timeout=2)
            
            # Send startup packet
            user = f"postgres.{project_id}".encode('utf-8')
            database = b"postgres"
            
            packet = b""
            packet += b"user\x00" + user + b"\x00"
            packet += b"database\x00" + database + b"\x00"
            packet += b"\x00"
            
            length = len(packet) + 8
            header = length.to_bytes(4, byteorder='big') + (196608).to_bytes(4, byteorder='big')
            
            s.sendall(header + packet)
            
            response = s.recv(1024)
            s.close()
            
            res_str = response.decode('utf-8', errors='ignore')
            if "tenant/user" in res_str and "not found" in res_str:
                # Tenant not found
                pass
            elif "password authentication failed" in res_str or "R" in res_str or len(response) > 0:
                print(f"[+] FOUND IT: {host} (ip: {ip})")
                print(f"    Response: {repr(response)}")
                print(f"    Text: {res_str[:200]}")
            else:
                print(f"[?] Connected to {host} but got response: {repr(response)}")
                
        except socket.gaierror:
            pass
        except Exception as e:
            pass

print("Scan complete.")
