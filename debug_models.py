import json
import re

def run_debug():
    try:
        with open('models_debug.json', 'rb') as f:
            content = f.read().decode('utf-16', errors='ignore')
            
        data = json.loads(content)
        print("AUTHORIZED MODELS:")
        for m in data.get('models', []):
            name = m.get('name', 'UNKNOWN')
            methods = m.get('supportedGenerationMethods', [])
            print(f"- {name} | Methods: {', '.join(methods)}")
            
    except Exception as e:
        print(f"FAILED TO PARSE: {str(e)}")
        # Fallback to regex if JSON parsing fails
        try:
            with open('models_debug.json', 'rb') as f:
                content = f.read().decode('utf-16', errors='ignore')
                names = re.findall(r'"name":\s*"([^"]+)"', content)
                print("REGEX EXTRACTED NAMES:")
                for n in names:
                    print(f"- {n}")
        except:
            print("TOTAL FAILURE TO READ FILE")

if __name__ == "__main__":
    run_debug()
