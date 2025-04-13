from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/calcular', methods=['POST'])
def calculator():
    data = request.get_json()
    precio = data.get('precio', 0)
    cantidad = data.get('cantidad', 0)
    valor_total = precio * cantidad
    return jsonify({ "valorTotal": valor_total })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=4000)