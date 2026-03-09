/**
 * Script de Migração de Dados
 * 
 * Este script associa todos os dados existentes (transações e preços) 
 * ao primeiro usuário criado.
 * 
 * Execute: node scripts/migrate-data.js
 */

const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/User');
const Transaction = require('../models/Transaction');
const CurrentPrice = require('../models/CurrentPrice');

const migrateData = async () => {
  try {
    console.log('🔄 Conectando ao MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/wealthyboard');
    console.log('✅ Conectado!');

    // Verificar se já existe usuário
    const existingUser = await User.findOne();
    
    if (!existingUser) {
      console.log('\n❌ Nenhum usuário encontrado!');
      console.log('👉 Crie uma conta primeiro através da interface.');
      console.log('👉 Depois execute este script novamente.');
      await mongoose.connection.close();
      return;
    }

    console.log(`\n👤 Usuário encontrado: ${existingUser.name} (${existingUser.email})`);

    // Contar transações sem userId
    const transactionsWithoutUser = await Transaction.countDocuments({ userId: null });
    console.log(`\n📊 Transações sem usuário: ${transactionsWithoutUser}`);

    if (transactionsWithoutUser > 0) {
      console.log('🔄 Associando transações ao usuário...');
      const result = await Transaction.updateMany(
        { userId: null },
        { $set: { userId: existingUser._id } }
      );
      console.log(`✅ ${result.modifiedCount} transações atualizadas!`);
    } else {
      console.log('✅ Todas as transações já têm usuário!');
    }

    // Contar preços sem userId
    const pricesWithoutUser = await CurrentPrice.countDocuments({ userId: null });
    console.log(`\n💰 Preços sem usuário: ${pricesWithoutUser}`);

    if (pricesWithoutUser > 0) {
      console.log('🔄 Associando preços ao usuário...');
      const result = await CurrentPrice.updateMany(
        { userId: null },
        { $set: { userId: existingUser._id } }
      );
      console.log(`✅ ${result.modifiedCount} preços atualizados!`);
    } else {
      console.log('✅ Todos os preços já têm usuário!');
    }

    console.log('\n🎉 Migração concluída com sucesso!');
    console.log(`📦 Todos os dados pertencem agora a: ${existingUser.name}\n`);

    await mongoose.connection.close();
    console.log('✅ Conexão fechada.\n');
    
  } catch (error) {
    console.error('\n❌ Erro na migração:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

// Executar migração
migrateData();
