import { motion } from 'framer-motion';

export default function About() {
  return (
    <div className="container mx-auto px-4 py-16 md:py-24 max-w-3xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3">Nossa história</p>
        <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-8">Sobre a Opps Wear</h1>

        <div className="space-y-6 text-muted-foreground leading-relaxed">
          <p>
            A <strong className="text-foreground">Opps Wear</strong> nasceu da paixão por moda masculina de qualidade.
            Acreditamos que cada peça de roupa conta uma história e define a atitude de quem a veste.
          </p>
          <p>
            Nossa curadoria é cuidadosa: selecionamos apenas peças que combinam design contemporâneo,
            materiais premium e conforto excepcional. Do casual ao sofisticado, cada item reflete
            nosso compromisso com a excelência.
          </p>
          <p>
            Mais do que uma marca, somos um estilo de vida. Para homens que valorizam qualidade,
            autenticidade e bom gosto em cada detalhe.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-3 gap-6 text-center">
          {[
            { value: '100%', label: 'Premium' },
            { value: 'Curadoria', label: 'Exclusiva' },
            { value: 'Entrega', label: 'Nacional' },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="p-6 rounded-xl bg-card border border-border"
            >
              <div className="font-display text-xl font-bold text-foreground">{item.value}</div>
              <div className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">{item.label}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
